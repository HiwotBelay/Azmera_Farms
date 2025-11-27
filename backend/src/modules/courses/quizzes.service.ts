import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion, QuestionType } from './entities/quiz-question.entity';
import { QuizAttempt, AttemptStatus } from './entities/quiz-attempt.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { Course } from './entities/course.entity';
import { User } from '../auth/entities/user.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    @InjectRepository(QuizAnswer)
    private answerRepository: Repository<QuizAnswer>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createQuizDto: CreateQuizDto, creatorId: string): Promise<Quiz> {
    const course = await this.courseRepository.findOne({
      where: { id: createQuizDto.courseId },
      relations: ['creator'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.creatorId !== creatorId) {
      throw new ForbiddenException('You can only create quizzes for your own courses');
    }

    const quiz = this.quizRepository.create({
      courseId: createQuizDto.courseId,
      title: createQuizDto.title,
      description: createQuizDto.description,
      passingScore: createQuizDto.passingScore ?? 70,
      timeLimit: createQuizDto.timeLimit ?? 30,
      isActive: createQuizDto.isActive ?? true,
      allowRetake: createQuizDto.allowRetake ?? false,
      maxAttempts: createQuizDto.maxAttempts ?? 1,
    });

    const savedQuiz = await this.quizRepository.save(quiz);

    // Create questions if provided
    if (createQuizDto.questions && createQuizDto.questions.length > 0) {
      const questions = createQuizDto.questions.map((q, index) =>
        this.questionRepository.create({
          quizId: savedQuiz.id,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswers: q.correctAnswers,
          points: q.points ?? 1,
          order: q.order ?? index,
          explanation: q.explanation,
        }),
      );

      await this.questionRepository.save(questions);
    }

    return this.findOne(savedQuiz.id);
  }

  async findAll(courseId: string): Promise<Quiz[]> {
    return await this.quizRepository.find({
      where: { courseId, isActive: true },
      relations: ['questions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions', 'course'],
      order: { questions: { order: 'ASC' } },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async addQuestion(quizId: string, questionDto: CreateQuizQuestionDto, creatorId: string): Promise<QuizQuestion> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['course'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.creatorId !== creatorId) {
      throw new ForbiddenException('You can only add questions to your own quizzes');
    }

    const question = this.questionRepository.create({
      quizId,
      ...questionDto,
      order: questionDto.order ?? (await this.questionRepository.count({ where: { quizId } })),
    });

    return await this.questionRepository.save(question);
  }

  async startAttempt(quizId: string, userId: string): Promise<QuizAttempt> {
    const quiz = await this.findOne(quizId);

    // Check if user has reached max attempts
    if (quiz.maxAttempts > 0) {
      const attempts = await this.attemptRepository.find({
        where: { quizId, userId },
      });

      if (attempts.length >= quiz.maxAttempts) {
        throw new BadRequestException('Maximum attempts reached for this quiz');
      }
    }

    // Check if there's an in-progress attempt
    const inProgressAttempt = await this.attemptRepository.findOne({
      where: { quizId, userId, status: AttemptStatus.IN_PROGRESS },
    });

    if (inProgressAttempt) {
      return inProgressAttempt;
    }

    const attempt = this.attemptRepository.create({
      quizId,
      userId,
      status: AttemptStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    return await this.attemptRepository.save(attempt);
  }

  async submitAttempt(
    attemptId: string,
    submitDto: SubmitQuizAttemptDto,
    userId: string,
  ): Promise<QuizAttempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['quiz', 'quiz.questions'],
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('This attempt has already been completed');
    }

    // Check time limit
    if (attempt.quiz.timeLimit > 0 && attempt.startedAt) {
      const elapsedMinutes =
        (new Date().getTime() - attempt.startedAt.getTime()) / 1000 / 60;
      if (elapsedMinutes > attempt.quiz.timeLimit) {
        attempt.status = AttemptStatus.TIMED_OUT;
        await this.attemptRepository.save(attempt);
        throw new BadRequestException('Time limit exceeded');
      }
    }

    let totalScore = 0;
    let totalPoints = 0;

    // Grade each answer
    for (const answerDto of submitDto.answers) {
      const question = attempt.quiz.questions.find((q) => q.id === answerDto.questionId);
      if (!question) continue;

      totalPoints += question.points;

      const isCorrect = this.checkAnswer(question, answerDto.answers);
      const pointsEarned = isCorrect ? question.points : 0;
      totalScore += pointsEarned;

      const answer = this.answerRepository.create({
        attemptId: attempt.id,
        questionId: question.id,
        answers: answerDto.answers,
        isCorrect,
        points: pointsEarned,
      });

      await this.answerRepository.save(answer);
    }

    const percentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    const passed = percentage >= attempt.quiz.passingScore;

    attempt.status = AttemptStatus.COMPLETED;
    attempt.score = totalScore;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.completedAt = new Date();

    return await this.attemptRepository.save(attempt);
  }

  private checkAnswer(question: QuizQuestion, userAnswers: string[]): boolean {
    const correctAnswers = question.correctAnswers.map((a) => a.toLowerCase().trim());
    const userAnswersNormalized = userAnswers.map((a) => a.toLowerCase().trim());

    if (question.type === QuestionType.TRUE_FALSE) {
      return (
        correctAnswers.length === userAnswersNormalized.length &&
        correctAnswers.every((ans) => userAnswersNormalized.includes(ans))
      );
    }

    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      return (
        correctAnswers.length === userAnswersNormalized.length &&
        correctAnswers.every((ans) => userAnswersNormalized.includes(ans))
      );
    }

    // For short answer, do partial matching
    if (question.type === QuestionType.SHORT_ANSWER) {
      return correctAnswers.some((correct) =>
        userAnswersNormalized.some((user) => user.includes(correct) || correct.includes(user)),
      );
    }

    return false;
  }

  async getAttempt(attemptId: string, userId: string): Promise<QuizAttempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['quiz', 'quiz.questions', 'answers', 'answers.question'],
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    return attempt;
  }

  async getUserAttempts(quizId: string, userId: string): Promise<QuizAttempt[]> {
    return await this.attemptRepository.find({
      where: { quizId, userId },
      relations: ['quiz'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(quizId: string, creatorId: string): Promise<void> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['course'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.creatorId !== creatorId) {
      throw new ForbiddenException('You can only delete your own quizzes');
    }

    await this.quizRepository.remove(quiz);
  }
}

