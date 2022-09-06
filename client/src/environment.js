import { sprintf } from "sprintf-js";

const environment = {
	SERVER_URL: sprintf("%s//%s:9000/", window.location.protocol, window.location.hostname)
};

export default environment;