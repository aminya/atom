'use babel';

import SelectListView from 'atom-select-list';

import { TextEditor } from 'atom';
import { setLineEnding } from './main';

export class Selector {
  lineEndingListView;
  modalPanel;

  // Make a selector object (should be called once)
  constructor(selectorItems) {
    if (!this.modalPanel) {
      // Defining a SelectListView with methods - https://github.com/atom/atom-select-list
      this.lineEndingListView = new SelectListView({
        // an array containing the objects you want to show in the select list
        items: selectorItems,

        // called whenever an item needs to be displayed.
        elementForItem: lineEnding => {
          const element = document.createElement('li');
          element.textContent = lineEnding.name;
          return element;
        },

        // called to retrieve a string property on each item and that will be used to filter them.
        filterKeyForItem: lineEnding => {
          return lineEnding.name;
        },

        // called when the user clicks or presses Enter on an item. // use `=>` for `this`
        didConfirmSelection: lineEnding => {
          const editor = atom.workspace.getActiveTextEditor();
          if (editor instanceof TextEditor) {
            setLineEnding(editor, lineEnding.value);
          }
          this.modalPanel.hide();
        },

        // called when the user presses Esc or the list loses focus. // use `=>` for `this`
        didCancelSelection: () => {
          this.modalPanel.hide();
        }
      });

      // Adding SelectListView to panel
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.lineEndingListView
      });
    } else {
      atom.notifications.addError('First dispose() the Selector object');
    }
  }

  // Show a selector object
  show() {
    this.lineEndingListView.reset();
    this.modalPanel.show();
    this.lineEndingListView.focus();
  }

  // Dispose selector
  dispose() {
    this.lineEndingListView.destroy();
    this.modalPanel.destroy();
    this.modalPanel = null;
  }
}
