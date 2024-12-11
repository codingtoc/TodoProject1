import { api } from "lwc";
import LightningModal from "lightning/modal";

export default class ModalPopup extends LightningModal {
  @api todo = {};
  subject;
  dueDate;
  completedDateTime;
  isCompleted = false;

  connectedCallback() {
    this.subject = this.todo.subject;
    this.dueDate = this.todo.dueDate;
    this.isCompleted = this.todo.isCompleted;
    this.completedDateTime = this.todo.completedDateTime;
  }

  get isEditClicked() {
    return this.todo.recordId ? true : false;
  }

  get title() {
    return this.todo.recordId ? "Edit Todo" : "Add Todo";
  }

  handleCancel() {
    this.close(undefined);
    this.initTodo();
  }

  handleSave() {
    this.todo = {
      recordId: this.todo.recordId,
      subject: this.subject,
      dueDate: this.dueDate,
      isCompleted: this.isCompleted
    };
    this.close(this.todo);
    this.initTodo();
  }

  handleChangeSubject(event) {
    this.subject = event.target.value;
  }

  handleChangeDueDate(event) {
    this.dueDate = event.target.value;
  }

  handleChangeIsCompleted(event) {
    this.isCompleted = event.target.checked;
  }

  initTodo() {
    this.subject = null;
    this.dueDate = null;
    this.isCompleted = false;
    this.completedDateTime = null;
  }
}
