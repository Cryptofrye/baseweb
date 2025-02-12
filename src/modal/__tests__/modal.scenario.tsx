/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';

import { Button } from '../../button';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton, SIZE } from '..';

export function Scenario({ closeable = true }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // adding mountNode so that rtl vrts work render properly. this is because the portal
  // is not wrapped in a dir="rtl" attribute at ladle root. ensure that the modal
  // mounts into the scenario react tree where we control the dir attr.
  React.useEffect(() => {
    setIsOpen(true);
  }, []);
  const modalRoot = React.useRef<any>(null);

  return (
    <React.Fragment>
      <Button onClick={() => setIsOpen(true)} className="open-modal-button">
        Open Modal
      </Button>
      <Modal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        size={SIZE.default}
        mountNode={modalRoot.current}
        closeable={closeable}
      >
        <ModalHeader>Hello world</ModalHeader>
        <ModalBody>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare faucibus ex, non
          facilisis nisl. Maecenas aliquet mauris ut tempus.
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => setIsOpen(false)} data-e2e="cancel-button">
            Cancel
          </ModalButton>
          <ModalButton onClick={() => setIsOpen(false)}>Okay</ModalButton>
        </ModalFooter>
      </Modal>
      <div ref={modalRoot} />
    </React.Fragment>
  );
}
