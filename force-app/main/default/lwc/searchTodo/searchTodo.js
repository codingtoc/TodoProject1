import { LightningElement } from "lwc";

export default class SearchTodo extends LightningElement {
  searchText;
  status = "All";

  get options() {
    return [
      { label: "All", value: "All" },
      { label: "Open", value: "Open" },
      { label: "Completed", value: "Completed" }
    ];
  }

  handleSearchText(event) {
    this.searchText = event.target.value;
    const searchTextEvent = new CustomEvent("searchtext", {
      detail: this.searchText
    });
    this.dispatchEvent(searchTextEvent);
  }

  handleStatus(event) {
    this.status = event.target.value;
    const statusEvent = new CustomEvent("status", {
      detail: this.status
    });
    this.dispatchEvent(statusEvent);
  }
}
