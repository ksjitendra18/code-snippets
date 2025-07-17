import { hash, verify } from "@node-rs/argon2";

export const hashPassword = async ({
  password: enteredPassword,
}: {
  password: string;
}) => {
  try {
    const hashedPassword = await hash(enteredPassword, {
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 2,
    });
    return hashedPassword;
  } catch (error) {
    console.log("Error while creating password ", error);
    throw new Error("Error while creating password");
  }
};

hashPassword({ password: "Jitendra@18" }).then(console.log);

export const verifyPassword = async ({
  enteredPassword,
  hashedPassword,
}: {
  enteredPassword: string;
  hashedPassword: string;
}) => {
  return await verify(hashedPassword, enteredPassword);
};
