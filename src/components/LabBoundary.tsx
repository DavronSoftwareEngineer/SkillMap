import { Component } from "react";
import type { ReactNode } from "react";

export class LabBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div role="alert"><h3>Laboratoriya yuklanmadi</h3><p>Saqlangan yozuvlar o'chirilmagan. Internetni tekshirib sahifani yangilang.</p><button onClick={() => window.location.reload()}>Sahifani yangilash</button></div> : this.props.children;
  }
}
