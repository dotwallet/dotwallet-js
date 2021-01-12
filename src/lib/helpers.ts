export const render = (node: Element, template: string) => {
  if (!node) return;
  node.innerHTML = template;
};
