type JSONPrimitive = string | number | boolean | null;
type JSONArray = JSON[];
type JSONObject = { [key: string]: JSON | undefined };

export type JSON = JSONPrimitive | JSONArray | JSONObject;
