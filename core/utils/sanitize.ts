export function sanitize(texto: string) {
  return texto
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[{}]/g, '')
    .toLowerCase();
}
