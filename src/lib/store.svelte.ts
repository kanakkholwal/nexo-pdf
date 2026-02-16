import {
	writable
} from 'svelte/store';

export const globalState = writable({
	loader:{
		show: false,
		message: 'Loading...'
	},
	alert: {
		show: false,
		type: 'info', // 'success', 'error', 'warning'
		title: '',
		description: '',
	},

})


export function showLoader(message = 'Loading...') {
	globalState.update((state) => ({
		...state,
		loader: {
			show: true,
			message
		},
	}));
}

export function hideLoader() {
	globalState.update((state) => ({
		...state,
		loader: {
			show: false,
			message: ''
		},
	}));
}

export function showAlert(title: string, description: string,type: 'success' | 'error' | 'warning' | 'info' = 'error') {
	globalState.update((state) => ({
		...state,
		alert: {
			show: true,
			type,
			title,
			description
		},
	}));
}

export function hideAlert() {
	globalState.update((state) => ({
		...state,
		alert: {
			show: false,
			type: 'info',
			title: '',
			description: ''
		},
	}));
}