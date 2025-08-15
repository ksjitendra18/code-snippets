"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface BreadCrumb {
  label: string;
  href: string;
}

interface BreadCrumbsProps {
  customLabels?: Record<string, string>;
  separator?: string;
  className?: string;
  homeLabel?: string;
  showHome?: boolean;
}

export const BreadCrumbs = ({
  customLabels = {},
  separator = ">>",
  className = "",
  homeLabel = "Home",
  showHome = true,
}: BreadCrumbsProps) => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const generateBreadcrumbs = (): BreadCrumb[] => {
    const segments = pathname.split("/").filter((segment) => segment !== "");
    const breadcrumbs: BreadCrumb[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: homeLabel,
        href: "/",
      });
    }

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      const label =
        customLabels[href] || customLabels[segment] || formatSegment(segment);

      breadcrumbs.push({
        label,
        href,
      });
    });

    return breadcrumbs;
  };

  const formatSegment = (segment: string): string => {
    return segment
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex mt-4 items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={crumb.href}>
              <li className="flex items-center">
                {isLast ? (
                  <span
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className="flex items-center">
                  <span className="text-gray-400 mx-2">{separator}</span>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
