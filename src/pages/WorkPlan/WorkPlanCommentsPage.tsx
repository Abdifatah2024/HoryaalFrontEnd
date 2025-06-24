import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchAllWorkPlansWithComments,
  addComment,
  clearWorkPlanState,
} from "./workPlanSlice";

const WorkPlanCommentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { workPlans, loading, error } = useAppSelector((state) => state.workPlan);

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [activeCommentBox, setActiveCommentBox] = useState<number | null>(null);
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    dispatch(fetchAllWorkPlansWithComments());
    return () => {
      dispatch(clearWorkPlanState());
    };
  }, [dispatch]);

  const handleCommentChange = (workPlanId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [workPlanId]: value }));
  };

  const handleSubmitComment = (workPlanId: number) => {
    const comment = commentInputs[workPlanId]?.trim();
    if (!comment) return;

    dispatch(addComment({ workPlanId, comment, status: "Pending" }));
    setCommentInputs((prev) => ({ ...prev, [workPlanId]: "" }));
    setActiveCommentBox(null);
    // Show comments after submitting a new one
    setShowComments((prev) => ({ ...prev, [workPlanId]: true }));
  };

  const toggleComments = (workPlanId: number) => {
    setShowComments((prev) => ({
      ...prev,
      [workPlanId]: !prev[workPlanId]
    }));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">WorkPlan</h1>
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading work plans...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading work plans: {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {workPlans.length === 0 && !loading && !error && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No work plans found</h3>
            <p className="mt-1 text-gray-500">Start by creating a work plan to begin discussions.</p>
          </div>
        )}

        {workPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow mb-4">
            {/* Work Plan Header */}
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {plan.assignedTo?.fullName?.charAt(0) || "W"}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatDate(plan.createdAt)}</span>
                    <span className="mx-1">·</span>
                    <svg className="h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1">{plan.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Plan Content */}
            <div className="p-4">
              <p className="text-gray-800 mb-2">{plan.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                <span className="font-medium">Period:</span> {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Comments ({plan.WorkPlanComment?.length || 0})
                </h4>
                {plan.WorkPlanComment?.length > 0 && (
                  <button 
                    onClick={() => toggleComments(plan.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showComments[plan.id] ? 'Hide comments' : 'Show comments'}
                  </button>
                )}
              </div>

              {plan.WorkPlanComment?.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : showComments[plan.id] ? (
                <div className="space-y-3">
                  {plan.WorkPlanComment.map((comment) => (
                    <div key={comment.id} className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                        {comment.user?.fullName?.charAt(0) || "U"}
                      </div>
                      <div className="ml-3">
                        <div className="bg-white rounded-lg p-3 shadow-xs">
                          <div className="flex items-baseline">
                            <span className="text-sm font-semibold text-gray-900 mr-2">
                              {comment.user?.fullName || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 mt-1">
                            {comment.comment}
                          </p>
                        </div>
                        <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                          <button className="hover:text-blue-600">Like</button>
                          <button className="hover:text-blue-600">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Add Comment */}
              <div className="mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                    Y
                  </div>
                  <div className="ml-3 flex-1">
                    {activeCommentBox === plan.id ? (
                      <div>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                          placeholder="Write a comment..."
                          rows={2}
                          value={commentInputs[plan.id] || ""}
                          onChange={(e) => handleCommentChange(plan.id, e.target.value)}
                          autoFocus
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => setActiveCommentBox(null)}
                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitComment(plan.id)}
                            disabled={!commentInputs[plan.id]?.trim()}
                            className={`px-3 py-1 text-sm text-white rounded ${
                              commentInputs[plan.id]?.trim()
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-400 cursor-not-allowed'
                            }`}
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white cursor-text hover:bg-gray-50"
                        onClick={() => setActiveCommentBox(plan.id)}
                      >
                        <span className="text-sm text-gray-500">Write a comment...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkPlanCommentsPage;