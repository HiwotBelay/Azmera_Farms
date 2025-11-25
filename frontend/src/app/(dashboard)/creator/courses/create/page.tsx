"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import {
  Upload,
  Video,
  FileText,
  Plus,
  X,
  Save,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type ContentType = "video" | "document";
type ContentStatus = "draft" | "published";

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  file?: File | string;
  duration?: string;
  fileSize?: string;
  status: ContentStatus;
  order: number;
}

interface Section {
  id: string;
  title: string;
  description: string;
  contents: ContentItem[];
  order: number;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    language: "English",
    level: "Beginner",
    thumbnail: null as File | null,
    thumbnailPreview: "",
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    "Crop Production",
    "Livestock Management",
    "Agribusiness",
    "Sustainable Farming",
    "Agricultural Technology",
    "Food Processing",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData({
        ...courseData,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file),
      });
    }
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "",
      description: "",
      contents: [],
      order: sections.length + 1,
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
    if (activeSectionId === id) {
      setActiveSectionId(null);
    }
  };

  const addContentToSection = (sectionId: string, type: ContentType) => {
    const newContent: ContentItem = {
      id: Date.now().toString(),
      type,
      title: "",
      description: "",
      status: "draft",
      order: 0,
    };

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          newContent.order = section.contents.length;
          return {
            ...section,
            contents: [...section.contents, newContent],
          };
        }
        return section;
      })
    );
  };

  const updateContent = (
    sectionId: string,
    contentId: string,
    updates: Partial<ContentItem>
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            contents: section.contents.map((content) =>
              content.id === contentId ? { ...content, ...updates } : content
            ),
          };
        }
        return section;
      })
    );
  };

  const handleFileUpload = (
    sectionId: string,
    contentId: string,
    file: File,
    type: ContentType
  ) => {
    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    updateContent(sectionId, contentId, {
      file,
      fileSize,
      ...(type === "video" && { duration: "0:00" }), // Will be calculated after upload
    });
  };

  const deleteContent = (sectionId: string, contentId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            contents: section.contents.filter(
              (content) => content.id !== contentId
            ),
          };
        }
        return section;
      })
    );
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      const { coursesApi } = await import("@/modules/courses/api/courses.api");

      // Get publish option
      const publishOption = (
        document.querySelector(
          'input[name="publish"]:checked'
        ) as HTMLInputElement
      )?.value;

      const coursePayload = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level.toUpperCase() as
          | "BEGINNER"
          | "INTERMEDIATE"
          | "ADVANCED",
        language: courseData.language.toUpperCase() as "ENGLISH" | "AMHARIC",
        price: courseData.price ? parseFloat(courseData.price) : 0,
        status: (publishOption === "publish" ? "PUBLISHED" : "DRAFT") as
          | "DRAFT"
          | "PUBLISHED",
        sections: sections.map((section, index) => ({
          title: section.title,
          description: section.description,
          order: index,
          lessons: section.contents.map((content, lessonIndex) => ({
            title: content.title,
            description: content.description,
            type: content.type === "video" ? "VIDEO" : "DOCUMENT",
            videoUrl:
              content.type === "video" && content.file instanceof File
                ? URL.createObjectURL(content.file)
                : undefined,
            documentUrl:
              content.type === "document" && content.file instanceof File
                ? URL.createObjectURL(content.file)
                : undefined,
            duration: content.duration,
            order: lessonIndex,
          })),
        })),
      };

      await coursesApi.create(coursePayload);
      alert("Course saved successfully!");
      router.push("/creator/courses");
    } catch (error: any) {
      alert(error.message || "Failed to save course. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const canProceedToStep2 = () => {
    return (
      courseData.title.trim() !== "" &&
      courseData.description.trim() !== "" &&
      courseData.category !== "" &&
      courseData.thumbnail !== null
    );
  };

  const canProceedToStep3 = () => {
    return sections.length > 0 && sections.every((s) => s.title.trim() !== "");
  };

  return (
    <CreatorDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNum
                        ? "bg-[#01BC63] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepNum ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    {stepNum === 1 && "Course Details"}
                    {stepNum === 2 && "Course Structure"}
                    {stepNum === 3 && "Review & Publish"}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step > stepNum ? "bg-[#01BC63]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Course Details */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Course Details
            </h2>

            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                  placeholder="e.g., Modern Crop Production Techniques"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Choose a clear, descriptive title that reflects your course
                  content
                </p>
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Course Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                  rows={6}
                  placeholder="Describe what students will learn in this course..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {courseData.description.length}/2000 characters
                </p>
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) =>
                      setCourseData({ ...courseData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={courseData.level}
                    onChange={(e) =>
                      setCourseData({ ...courseData, level: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price (ETB)
                  </label>
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData({ ...courseData, price: e.target.value })
                    }
                    placeholder="0 for free course"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Language
                  </label>
                  <select
                    value={courseData.language}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
                  >
                    <option value="English">English</option>
                    <option value="Amharic">Amharic</option>
                  </select>
                </div>
              </div>

              {/* Course Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Course Thumbnail <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#01BC63] transition-colors">
                  {courseData.thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={courseData.thumbnailPreview}
                        alt="Thumbnail preview"
                        className="max-w-full h-48 mx-auto rounded-lg object-cover"
                      />
                      <button
                        onClick={() =>
                          setCourseData({
                            ...courseData,
                            thumbnail: null,
                            thumbnailPreview: "",
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-2">
                        Upload Course Thumbnail
                      </p>
                      <p className="text-sm text-gray-500">
                        Recommended: 1280x720px (16:9 ratio)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2()}
                className="px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue to Structure
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Course Structure */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Course Structure
                </h2>
                <button
                  onClick={addSection}
                  className="flex items-center gap-2 px-4 py-2 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Section
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    No sections yet
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Start by adding your first section
                  </p>
                  <button
                    onClick={addSection}
                    className="px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all"
                  >
                    Add First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#01BC63] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              updateSection(section.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder={`Section ${index + 1} Title`}
                            className="text-lg font-semibold text-gray-900 w-full mb-2 border-none focus:outline-none focus:ring-0 p-0"
                          />
                          <textarea
                            value={section.description}
                            onChange={(e) =>
                              updateSection(section.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Section description (optional)"
                            rows={2}
                            className="w-full text-sm text-gray-600 border-none focus:outline-none focus:ring-0 p-0 resize-none"
                          />
                        </div>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content Items */}
                      <div className="space-y-3 mt-4">
                        {section.contents.map((content) => (
                          <div
                            key={content.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                {content.type === "video" ? (
                                  <Video className="w-8 h-8 text-blue-500" />
                                ) : (
                                  <FileText className="w-8 h-8 text-green-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={content.title}
                                  onChange={(e) =>
                                    updateContent(section.id, content.id, {
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder={`${
                                    content.type === "video"
                                      ? "Video"
                                      : "Document"
                                  } title`}
                                  className="w-full font-medium text-gray-900 mb-2 border-none bg-transparent focus:outline-none focus:ring-0 p-0"
                                />
                                <textarea
                                  value={content.description}
                                  onChange={(e) =>
                                    updateContent(section.id, content.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Add description..."
                                  rows={2}
                                  className="w-full text-sm text-gray-600 mb-2 border-none bg-transparent focus:outline-none focus:ring-0 p-0 resize-none"
                                />
                                {content.file ? (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>
                                      {content.file instanceof File
                                        ? content.file.name
                                        : content.file}
                                    </span>
                                    {content.fileSize && (
                                      <span className="text-gray-400">
                                        • {content.fileSize}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#01BC63] cursor-pointer transition-colors text-sm">
                                    <Upload className="w-4 h-4" />
                                    Upload{" "}
                                    {content.type === "video"
                                      ? "Video"
                                      : "Document"}
                                    <input
                                      type="file"
                                      accept={
                                        content.type === "video"
                                          ? "video/*"
                                          : ".pdf,.doc,.docx,.txt"
                                      }
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleFileUpload(
                                            section.id,
                                            content.id,
                                            file,
                                            content.type
                                          );
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  deleteContent(section.id, content.id)
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Content Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            addContentToSection(section.id, "video")
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Video className="w-4 h-4" />
                          Add Video
                        </button>
                        <button
                          onClick={() =>
                            addContentToSection(section.id, "document")
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          Add Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3()}
                className="px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Review & Publish
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Review & Publish
            </h2>

            <div className="space-y-6">
              {/* Course Summary */}
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Title:
                    </span>
                    <p className="text-gray-900">{courseData.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Category:
                    </span>
                    <p className="text-gray-900">{courseData.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Level:
                    </span>
                    <p className="text-gray-900">{courseData.level}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Price:
                    </span>
                    <p className="text-gray-900">
                      {courseData.price ? `ETB ${courseData.price}` : "Free"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Structure Summary */}
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Structure
                </h3>
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="border-l-4 border-[#01BC63] pl-4"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Section {index + 1}: {section.title || "Untitled"}
                      </h4>
                      <div className="ml-4 space-y-2">
                        {section.contents.map((content) => (
                          <div
                            key={content.id}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            {content.type === "video" ? (
                              <Video className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            <span>
                              {content.title || "Untitled"} -{" "}
                              {content.file ? (
                                <span className="text-green-600">Uploaded</span>
                              ) : (
                                <span className="text-yellow-600">Pending</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Options */}
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Publish Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="publish"
                      value="draft"
                      defaultChecked
                      className="w-4 h-4 text-[#01BC63]"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Save as Draft</p>
                      <p className="text-sm text-gray-600">
                        Save your course and continue editing later
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="publish"
                      value="publish"
                      className="w-4 h-4 text-[#01BC63]"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Publish Now</p>
                      <p className="text-sm text-gray-600">
                        Make your course available to students immediately
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Course
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </CreatorDashboardLayout>
  );
}
