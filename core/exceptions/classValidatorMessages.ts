type ValidationError = {
    property?: string;
    constraints?: Record<string, string>;
    children?: ValidationError[];
};

export default function getValidatorMessages(errors: ValidationError[]): { property: string; erros: Record<string, string> }[] {
    const result: { property: string; erros: Record<string, string> }[] = [];

    for (const err of errors) {
        if (err.constraints) {
            result.push({
                property: err.property ?? "",
                erros: { ...err.constraints }
            });

        }

        // percorre os filhos recursivamente
        if (err.children && err.children.length > 0) {
            result.push(...getValidatorMessages(err.children));
        }

    }

    return result;
}
