import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

	settings = {
		id: '',
		refreshDelay: '',
		resolution: {
			width: '',
			height: ''
		},
		unsplash: {
			enabled: false,
			accessKey: '',
			secretKey: '',
			collectionsId: ''
		},
		hass: {
			endpoint: '',
			token: ''
		}
	};
	isSaving: boolean = false;

	widgets: Array<any> = []

	ngOnInit(): void {
		this.loadSettings();
	}

	async loadSettings() {
		try {
			const resp = await fetch(`${environment.API.endpoint}/admin/settings`);
			const respJson = await resp.json();
			this.settings = {
				id: respJson.id || '',
				refreshDelay: respJson.refreshDelay || 60,
				resolution: {
					width: respJson?.resolution?.width || 1920,
					height: respJson?.resolution?.height || 1080
				},
				unsplash: {
					enabled: respJson?.unsplash?.enabled || false,
					accessKey: respJson?.unsplash?.accessKey || '',
					secretKey: respJson?.unsplash?.secretKey || '',
					collectionsId: respJson?.unsplash?.collectionsId ? respJson?.unsplash?.collectionsId.join(',') : ''
				},
				hass: {
					endpoint: respJson?.hass?.endpoint || '',
					token: respJson?.hass?.token || ''
				}
			};
			await this.loadWidgets();
		} catch(e) {
			console.log('Error while fetching settings', e);
		}
	}

	async loadWidgets() {
		try {
			const resp = await fetch(`${environment.API.endpoint}/admin/widgets/${this.settings.id}`);
			const respJson = await resp.json();
			this.widgets = respJson;
		} catch(e) {
			console.log('Error while fetching widgets', e);
		}
	}

	addWidget() {
		this.widgets.push({
			id: null,
			icon: '',
			entityId: '',
			prefix: '',
			suffix: '',
		});
	}

	removeWidget(index: number) {
		if (!confirm('Are you sure?'))
			return;
		this.widgets.splice(index, 1);
	}

	async saveSettings() {
		this.isSaving = true;
		try {
			await fetch(`${environment.API.endpoint}/admin/settings/${this.settings.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(Object.assign(this.settings, {
					unsplash: Object.assign(this.settings.unsplash, {
						collectionsId: this.settings.unsplash.collectionsId.includes(',') ? this.settings.unsplash.collectionsId.split(',') : [this.settings.unsplash.collectionsId]
					})
				}))
			});
		} catch(e) {
			console.log('Error while saving settings', e);
		}
		this.isSaving = false;
	}

	async saveWidgets() {
		this.isSaving = true;
		try {
			await fetch(`${environment.API.endpoint}/admin/widgets/${this.settings.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.widgets)
			});
		} catch(e) {
			console.log('Error while saving widgets', e);
		}
		this.isSaving = false;
	}

}
