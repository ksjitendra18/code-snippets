import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

export const SnippetVersions = ({ versions }) => {
  return (
    <>
      {versions.map((version) => (
        <div
          key={version.id}
          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            version.id === currentVersion.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          // onClick={() => onVersionChange(version)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={version.isCurrent ? "default" : "secondary"}
                className="text-xs"
              >
                v{version.version}
              </Badge>
              {version.isCurrent && (
                <Badge variant="outline" className="text-xs">
                  Current
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {version.createdAt.toLocaleDateString()}
            </span>
          </div>
          <h4 className="font-medium text-sm mb-1">{version.title}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">
            {version.changeDescription}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>{version.author}</span>
            <span>•</span>
            <Clock className="h-3 w-3" />
            <span>
              {version.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};
