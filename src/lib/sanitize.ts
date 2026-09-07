const BLOCKED_TAGS = "script,style,iframe,object,embed,link,meta,base,form,input,button,foreignObject,animate,animateMotion,animateTransform,set";
const SAFE_LINK = /^(?:https?:|mailto:|tel:|#|\/)/i;

// Kurs kontenti hozir repository ichidan keladi. Bu qatlam keyinchalik import/CMS
// qo'shilsa ham event handler yoki javascript: URL render bo'lmasligini ta'minlaydi.
export function sanitizeCourseHtml(html: string): string {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll(BLOCKED_TAGS).forEach((node) => node.remove());

  template.content.querySelectorAll<HTMLElement>("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on") || name === "srcdoc" || name === "style") {
        element.removeAttribute(attribute.name);
      }
      if ((name === "href" || name.endsWith(":href") || name === "src") && value && !SAFE_LINK.test(value.replace(/[\u0000-\u0020]/g, ''))) {
        element.removeAttribute(attribute.name);
      }
      if (name === 'srcset' || name === 'ping') element.removeAttribute(attribute.name);
    });
    if (element.tagName.toLowerCase() === 'a' && element.getAttribute('target') === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return template.innerHTML;
}
