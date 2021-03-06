import { LionField } from '@lion/form-core';

/**
 * LionInput: extension of lion-field with native input element in place and user friendly API.
 *
 * @customElement lion-input
 * @extends {LionField}
 */
// @ts-expect-error false positive for incompatible static get properties. Lit-element merges super properties already for you.
export class LionInput extends LionField {
  static get properties() {
    return {
      /**
       * A Boolean attribute which, if present, indicates that the user should not be able to edit
       * the value of the input. The difference between disabled and readonly is that read-only
       * controls can still function, whereas disabled controls generally do not function as
       * controls until they are enabled.
       *
       * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
       */
      readOnly: {
        type: Boolean,
        attribute: 'readonly',
        reflect: true,
      },
      type: {
        type: String,
        reflect: true,
      },
      placeholder: {
        type: String,
        reflect: true,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        // TODO: Find a better way to do value delegation via attr
        const native = document.createElement('input');
        const value = this.getAttribute('value');
        if (value) {
          native.setAttribute('value', value);
        }
        return native;
      },
    };
  }

  constructor() {
    super();
    this.readOnly = false;
    this.type = 'text';
    this.placeholder = '';
  }

  /**
   * @param {PropertyKey} name
   * @param {?} oldValue
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
    if (name === 'readOnly') {
      this.__delegateReadOnly();
    }
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__delegateReadOnly();
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('type')) {
      this._inputNode.type = this.type;
    }
    if (changedProperties.has('placeholder')) {
      this._inputNode.placeholder = this.placeholder;
    }
  }

  __delegateReadOnly() {
    if (this._inputNode) {
      this._inputNode.readOnly = this.readOnly;
    }
  }
}
