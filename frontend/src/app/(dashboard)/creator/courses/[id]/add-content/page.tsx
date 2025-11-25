"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import {
  ArrowLeft,
  Plus,
  Upload,
  Video,
  FileText,
  X,
  CheckCircle,
  Save,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type ContentType = "video" | "document";

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  file?: File | string;
  fileSize?: string;
  duration?: string;
  status: "draft" | "uploaded";
}

interface Section {
  id: string;
  title: string;
  description: string;
  contents: ContentItem[];
}

export default function AddContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  // Mock course data - in real app, fetch from API
  const [courseTitle] = useState("Modern Crop Production Techniques");

  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      title: "Introduction to Crop Production",
      description: "Basic concepts and fundamentals",
      contents: [
        {
          id: "1",
          type: "video",
          title: "Welcome to the Course",
          description: "Introduction video",
          status: "uploaded",
        },
      ],
    },
    {
      id: "2",
      title: "Advanced Techniques",
      description: "Learn advanced methods",
      contents: [],
    },
  ]);

  const [selectedSection, setSelectedSection] = useState<string | null>(
    sections[0]?.id || null
  );
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContentType, setNewContentType] = useState<ContentType>("video");
  const [uploading, setUploading] = useState(false);

  const addContentToSection = (sectionId: string, type: ContentType) => {
    const newContent: ContentItem = {
      id: Date.now().toString(),
      type,
      title: "",
      description: "",
      status: "draft",
    };

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            contents: [...section.contents, newContent],
          };
        }
        return section;
      })
    );
    setShowAddContentModal(false);
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
      status: "uploaded",
      ...(type === "video" && { duration: "0:00" }),
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
    // Simulate API call
    setTimeout(() => {
      setUploading(false);
      alert("Content added successfully!");
      router.push(`/creator/courses/${courseId}/edit`);
    }, 2000);
  };

  const selectedSectionData = sections.find((s) => s.id === selectedSection);

  return (
    <CreatorDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/creator/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add Content to Course
          </h1>
          <p className="text-gray-600">
            <span className="font-semibold">Course:</span> {courseTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Sections
                </h2>
                <button
                  onClick={() => setShowAddContentModal(true)}
                  className="p-2 text-[#01BC63] hover:bg-[#01BC63]/10 rounded-lg transition-colors"
                  title="Add new section"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedSection === section.id
                        ? "border-[#01BC63] bg-[#01BC63]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {
                          section.contents.filter((c) => c.type === "video")
                            .length
                        }
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {
                          section.contents.filter((c) => c.type === "document")
                            .length
                        }
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {selectedSectionData ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedSectionData.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedSectionData.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNewContentType("video");
                        addContentToSection(selectedSection, "video");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Video className="w-4 h-4" />
                      Add Video
                    </button>
                    <button
                      onClick={() => {
                        setNewContentType("document");
                        addContentToSection(selectedSection, "document");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Add Document
                    </button>
                  </div>
                </div>

                {selectedSectionData.contents.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">
                      No content in this section
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Add videos or documents to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSectionData.contents.map((content) => (
                      <div
                        key={content.id}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#01BC63] transition-colors"
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
                                updateContent(selectedSection, content.id, {
                                  title: e.target.value,
                                })
                              }
                              placeholder={`${
                                content.type === "video" ? "Video" : "Document"
                              } title`}
                              className="w-full font-semibold text-gray-900 mb-2 border-none bg-transparent focus:outline-none focus:ring-0 p-0"
                            />
                            <textarea
                              value={content.description}
                              onChange={(e) =>
                                updateContent(selectedSection, content.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Add description..."
                              rows={2}
                              className="w-full text-sm text-gray-600 mb-3 border-none bg-transparent focus:outline-none focus:ring-0 p-0 resize-none"
                            />
                            {content.file ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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
                                {content.duration && (
                                  <span className="text-gray-400">
                                    • {content.duration}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#01BC63] cursor-pointer transition-colors text-sm mb-2">
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
                                        selectedSection,
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
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  content.status === "uploaded"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {content.status === "uploaded"
                                  ? "Uploaded"
                                  : "Draft"}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              deleteContent(selectedSection, content.id)
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Select a section to add content
                </p>
              </div>
            )}

            {/* Save Button */}
            {selectedSectionData && (
              <div className="mt-6 flex justify-end">
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}
