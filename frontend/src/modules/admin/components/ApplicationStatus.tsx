"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { CreatorApplication } from "../api/admin.api";

interface ApplicationStatusProps {
  application: CreatorApplication;
}

export default function ApplicationStatus({ application }: ApplicationStatusProps) {
  const getStatusConfig = () => {
    switch (application.status) {
      case "APPROVED":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Application Approved!",
          message: "Congratulations! Your application has been approved. You can now create and publish courses.",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Application Rejected",
          message: application.rejectionReason || "Your application has been rejected. Please review the feedback and consider reapplying.",
        };
      case "PENDING":
      default:
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: "Application Under Review",
          message: "Your application is currently being reviewed by our team. We'll notify you once a decision is made.",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {/* Status Card */}
      <div
        className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-xl p-6 mb-6`}
      >
        <div className="flex items-start space-x-4">
          <StatusIcon className={`w-8 h-8 ${statusConfig.color} flex-shrink-0`} />
          <div className="flex-1">
            <h2 className={`text-xl font-bold ${statusConfig.color} mb-2`}>
              {statusConfig.title}
            </h2>
            <p className="text-gray-700">{statusConfig.message}</p>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Application Details</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="font-semibold text-gray-800 capitalize">
                {application.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Submitted On</p>
              <p className="font-semibold text-gray-800">
                {formatDate(application.submittedAt)}
              </p>
            </div>
            {application.reviewedAt && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Reviewed On</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(application.reviewedAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivation */}
        {application.motivation && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Motivation</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.motivation}
              </p>
            </div>
          </div>
        )}

        {/* Experience */}
        {application.experience && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Experience</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.experience}
              </p>
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {application.status === "REJECTED" && application.rejectionReason && (
          <div>
            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Rejection Reason
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 whitespace-pre-wrap">
                {application.rejectionReason}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {application.status === "APPROVED" && (
          <div className="pt-4">
            <a
              href="/dashboard"
              className="block w-full text-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

