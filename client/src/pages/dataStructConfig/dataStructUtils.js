export const TYPES = ["uint8_t","uint16_t","uint32_t","int8_t","int16_t","int32_t","float","bool"];

export const TYPE_BITS = {
  uint8_t: 8, uint16_t: 16, uint32_t: 32,
  int8_t: 8,  int16_t: 16,  int32_t: 32,
  float: 32,  bool: 8,
};

export function dotClass(type) {
  const b = TYPE_BITS[type];
  return b === 8 ? "dot-8" : b === 16 ? "dot-16" : b === 32 ? "dot-32" : "dot-other";
}

export function createField() {
  return { key: crypto.randomUUID(), name: "", type: "uint8_t", bits: 8, value: "", comment: "" };
}

export function parseStruct(raw) {
  const lines = raw
    .replace(/^[^{]*\{/, "")
    .replace(/\}[^}]*$/, "")
    .split("\n");

  return lines
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("//"))
    .map((line, idx) => {
      const commentMatch = line.match(/\/\/\s*(.+)/);
      const comment = commentMatch ? commentMatch[1].trim() : "";
      const clean = line.replace(/\/\/.*/, "").trim().replace(/;$/, "").trim();
      const parts = clean.split(/\s+/);
      if (parts.length < 2) throw new Error(`Line ${idx + 1} could not be parsed: "${line}"`);
      const type = parts[0];
      const name = parts[1];
      return {
        key: crypto.randomUUID(),
        name,
        type,
        bits: TYPE_BITS[type] ?? 0,
        value: "",
        comment,
      };
    });
}

export function normalizeImportedFields(parsed) {
  return parsed.map((f, idx) => {
    if (!f.name) throw new Error(`Field ${idx} missing "name"`);
    if (!f.type) throw new Error(`Field ${idx} missing "type"`);
    return {
      key: crypto.randomUUID(),
      name: String(f.name),
      type: String(f.type),
      bits: Number.parseInt(f.bits) || TYPE_BITS[f.type] || 8,
      value: f.value ?? "",
      comment: f.comment || "",
    };
  });
}

export function buildCopyJSON(radioId, fields) {
  return {
    radioId,
    fields: fields.map(({ name, type, bits, value, comment }) => ({
      name, type, bits: Number.parseInt(bits) || 0, value, comment
    }))
  };
}

export function buildCopyStruct(radioId, fields) {
  const lines = fields
    .map(f => `  ${f.type} ${f.name};${f.comment ? " // " + f.comment : ""}`)
    .join("\n");
  return `/* Radio ${radioId} */\ntypedef struct {\n${lines}\n} Radio${radioId}Data_t;`;
}

export function parseImportRaw(raw) {
  const cleaned = raw.trim().replace(/\n\s*\n/g, "\n");

  if (cleaned.includes("{") && cleaned.includes(";")) {
    return parseStruct(cleaned);
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const lines = cleaned.split("\n").map(l => l.trim()).filter(Boolean);
    parsed = lines.map((line, idx) => {
      try { return JSON.parse(line); }
      catch { throw new Error(`Line ${idx + 1} is not valid JSON`); }
    });
  }

  if (parsed.fields) parsed = parsed.fields;
  if (!Array.isArray(parsed)) throw new Error("Expected a JSON array or C struct");

  return normalizeImportedFields(parsed);
}
