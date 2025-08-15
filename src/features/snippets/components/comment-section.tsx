import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const mockComments = [
  {
    id: 1,
    author: "John Doe",
    content: "Great snippet! This really helped me solve a similar problem.",
    createdAt: new Date("2024-01-15T10:30:00"),
    avatar: "JD",
  },
  {
    id: 2,
    author: "Sarah Wilson",
    content:
      "Thanks for sharing. Could you explain how the error handling works in line 15?",
    createdAt: new Date("2024-01-16T14:20:00"),
    avatar: "SW",
  },
  {
    id: 3,
    author: "Mike Chen",
    content: "I modified this to work with TypeScript. Works perfectly!",
    createdAt: new Date("2024-01-17T09:45:00"),
    avatar: "MC",
  },
];

export function CommentsSection() {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h2 className="text-xl font-semibold">
          Comments ({mockComments.length})
        </h2>
      </div>

      <div className="space-y-4">
        {mockComments.map((comment) => (
          <Card key={comment.id} className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {comment.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">
                      {comment.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Sign in to add a comment</p>
            <Button variant="outline" className="mt-2" size="sm">
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
