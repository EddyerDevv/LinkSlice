"use client";
import { XIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useCallback } from "react";

interface ModalProps {
  state: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  children: React.ReactNode;
  modalClose?: (onClose: () => void) => void;
}

const generateModalId = () => `modalId-${Math.random().toString(36).slice(2)}`;

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}

function Modal({ state, children, modalClose }: ModalProps) {
  const [modalId] = useState(generateModalId());
  const [modalState, setModalState] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const mounted = useMounted();

  const onClose = useCallback(() => {
    const modalReference = modalRef.current;
    if (!(modalReference instanceof HTMLElement)) return;

    const closeModal = modalReference.querySelector(`#close-${modalId}`);
    if (!(closeModal instanceof HTMLElement)) return;

    setModalState(false);

    closeModal.addEventListener("transitionend", () => {
      state.setOpen(false);
    });
  }, [modalId, state.setOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (state.open) {
      if (modalClose) modalClose(onClose);

      timeoutId = setTimeout(() => {
        setModalState(true);
      }, 100);
    } else {
      setModalState(false);
    }

    return () => clearTimeout(timeoutId);
  }, [state.open]);

  return mounted
    ? createPortal(
        <main
          id={modalId}
          ref={modalRef}
          data-modalstate={modalState}
          className={`absolute flex flex-col items-center justify-center w-full h-full z-30`}
        >
          <div
            className="w-full h-full absolute z-[31] bg-black/50 backdrop-blur-md opacity-0 transition-[opacity] duration-[0.3s] ease-in-out data-[modalstate=true]:opacity-100 delay-[0.025s]"
            data-modalstate={modalState}
            id={`close-${modalId}`}
            onClick={onClose}
          ></div>
          <section
            data-modalstate={modalState}
            className="min-h-[9rem] bg-neutral-900/95 rounded-none border-[1px] border-rose-300 z-[32] absolute p-5 opacity-0 scale-[0.6] transition-[opacity,transform,border-radius] duration-[0.25s] ease-in-out data-[modalState=true]:opacity-100 data-[modalstate=true]:scale-[1] md:rounded-lg"
            id={`content-${modalId}`}
          >
            <XIcon
              className="w-[1.1rem] h-[1.1rem] text-rose-300 hover:text-neutral-200 absolute right-[0.625rem] top-[0.625rem] cursor-pointer transition-colors duration-[0.25s] ease-in-out"
              absoluteStrokeWidth
              onClick={onClose}
            />
            {children}
          </section>
        </main>,
        document.body
      )
    : null;
}

export default Modal;
