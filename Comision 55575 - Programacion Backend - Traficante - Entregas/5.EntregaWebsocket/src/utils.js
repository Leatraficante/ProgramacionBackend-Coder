import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); //obtener url de manera especifica desde el directorio donde estamos trabajando
const __dirname = dirname(__filename);

export { __dirname };
