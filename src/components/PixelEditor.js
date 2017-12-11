export const pixelEditor = (
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Pixel Editor</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        What color would you like to change this pixel to:
      </Modal.Body>

      <Modal.Footer>
        <Button>Close</Button>
        <Button bsStyle="primary">Save changes</Button>
      </Modal.Footer>

    </Modal.Dialog>
  </div>
);
