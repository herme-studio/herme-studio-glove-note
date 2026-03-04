/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { AddGlove } from "./pages/AddGlove";
import { ListenerList } from "./pages/ListenerList";
import { ListenerDetail } from "./pages/ListenerDetail";
import { HowToUse } from "./pages/HowToUse";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddGlove />} />
          <Route path="listeners" element={<ListenerList />} />
          <Route path="listeners/:name" element={<ListenerDetail />} />
          <Route path="how-to-use" element={<HowToUse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
