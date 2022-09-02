export default class Utils {

	static get pathProduct() {
		let path = window.location.pathname;

		return path.match(/.*[\\/](\d+)/)?.pop() || null;
	}

	static get token() {
		return sessionStorage.getItem("token") || "";
	}

	static set token(token) {
		sessionStorage.setItem("token", token);
	}

}