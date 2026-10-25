import { useCallback, useState } from 'react';
import { ConfirmContext } from './useConfirm';
import { Button, Modal } from './ui';

/* Confirmación propia: reemplaza a window.confirm (accesible y con el estilo del sitio). */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback(
    (options) => new Promise((resolve) => setState({ ...(typeof options === 'string' ? { message: options } : options), resolve })),
    []
  );
  const close = (answer) => {
    state.resolve(answer);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => close(false)} title={state?.title || 'Confirmar'}>
        <p className="text-gray-200 mb-6">{state?.message}</p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button variant="ghost" onClick={() => close(false)}>{state?.cancelLabel || 'VOLVER'}</Button>
          <Button variant={state?.danger === false ? 'primary' : 'danger'} onClick={() => close(true)}>
            {state?.confirmLabel || 'CONFIRMAR'}
          </Button>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}
