import { makeAutoObservable } from "mobx";

export default class ModalService {
	visible
	children
	title
	constructor() {
		this.visible = false
		this.children = null
		this.title=""
		makeAutoObservable( this );
	}

	show( newChildren, newTitle ) {
		this.visible = true
		this.children = newChildren
		this.title = newTitle
	}

	hide() {
		this.visible = false;
	}
}
