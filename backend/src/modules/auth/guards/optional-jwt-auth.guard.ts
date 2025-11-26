import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    
    // If no auth header, skip authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔓 OptionalJwtAuthGuard: No auth token, allowing request');
      return true;
    }
    
    console.log('🔑 OptionalJwtAuthGuard: Auth token found, attempting authentication');
    
    // Try to authenticate, but don't throw error if token is invalid
    const result = super.canActivate(context);
    
    // Handle different return types
    if (result instanceof Promise) {
      return result.catch((err) => {
        // If authentication fails (e.g., invalid token), allow the request to proceed
        console.log('⚠️ OptionalJwtAuthGuard: Authentication failed, allowing request:', err.message);
        return true;
      });
    } else if (result instanceof Observable) {
      return result.pipe(
        catchError((err) => {
          console.log('⚠️ OptionalJwtAuthGuard: Authentication failed, allowing request:', err.message);
          return of(true);
        })
      );
    } else {
      // Boolean result
      return result;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, return undefined instead of throwing
    if (err || !user) {
      if (err) {
        console.log('⚠️ OptionalJwtAuthGuard: Error during authentication:', err.message);
      } else {
        console.log('🔓 OptionalJwtAuthGuard: No user found, proceeding without authentication');
      }
      return undefined;
    }
    console.log('✅ OptionalJwtAuthGuard: User authenticated:', user.id, user.email, user.role);
    return user;
  }
}
