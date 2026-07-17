"use client";

import { useState } from "react";
import { PRIVACY_POLICY, TERMS_OF_USE, IMPORTANT_INFORMATION } from "@asd/domain";
import Modal from "@asd/ui/src/components/modal/Modal";

type ModalType = "privacy" | "terms" | "important" | null;

const MODALS: Record<NonNullable<ModalType>, { title: string; content: string }> = {
  important: { title: "Important Information", content: IMPORTANT_INFORMATION },
  privacy: { title: "Privacy Policy", content: PRIVACY_POLICY },
  terms: { title: "Terms of Use", content: TERMS_OF_USE },
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <div className="w-full text-white flex flex-col items-center px-2.5 bg-site-dark">
      <div className="text-xs text-center py-4 space-y-2.5">
        <p>
          Program outcomes vary according to each institution&apos;s specific
          curriculum and employment opportunities are not guaranteed.
        </p>
        <p>
          2002 - {year} All Star Directories, Inc. All rights Reserved.{" "}
          <span className="inline-flex items-center gap-2">
            <span>|</span>
            <button className="hover:underline cursor-pointer" onClick={() => setOpenModal("important")}>Important Information</button>
            <span>|</span>
            <button className="hover:underline cursor-pointer" onClick={() => setOpenModal("privacy")}>Privacy Policy</button>
            <span>|</span>
            <button className="hover:underline cursor-pointer" onClick={() => setOpenModal("terms")}>Terms of Use</button>
          </span>
        </p>
      </div>

      {openModal && (
        <Modal
          isOpen
          onClose={() => setOpenModal(null)}
          title={MODALS[openModal].title}
        >
          <div dangerouslySetInnerHTML={{ __html: MODALS[openModal].content }} />
        </Modal>
      )}
    </div>
  );
}
