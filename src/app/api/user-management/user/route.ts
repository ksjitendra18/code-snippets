import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { addNewUser } from "@/features/user-management/services";
import { NewUserSchema } from "@/features/user-management/validation/user";
import { z } from "zod/mini";

export const POST = async (req: Request) => {
  try {
    const requestData = await req.json();

    const { isAuthenticated, user } = await checkAuthentication();

    if (!isAuthenticated || !user) {
      return Response.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "You are not authenticated to perform this action",
          },
        },
        { status: 401 }
      );
    }

    if (user.role !== "SUPER_ADMIN") {
      return Response.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "You are not authorized to perform this action",
          },
        },
        { status: 401 }
      );
    }

    const result = NewUserSchema.safeParse(requestData);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: z.treeifyError(result.error),
          },
        },
        { status: 401 }
      );
    }

    await addNewUser({
      pfId: result.data.pfId,
      role: result.data.role,
    });
    return Response.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in user route", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
};
