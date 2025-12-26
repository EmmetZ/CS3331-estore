import type { UpdateUserPayload } from "@/types";

export type ProfileFormState = Pick<
  UpdateUserPayload,
  "username" | "email" | "phone" | "address"
>;

export type ProfileFormErrors = Partial<Record<keyof ProfileFormState, string>>;
