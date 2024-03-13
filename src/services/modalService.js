
export default class ModalService {
	visible

	constructor() {
		this.visible = false
	}

	show( config ) {
		this.visible = true;
	}

	hide() {
		this.visible = false;
	}
}
