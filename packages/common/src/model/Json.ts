type JsonPrimitive = string | number | boolean | null;
type JsonArray = Json[];
type JsonObject = { [key: string]: Json | undefined };

export type Json = JsonPrimitive | JsonArray | JsonObject;
