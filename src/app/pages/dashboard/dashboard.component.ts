import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

	@ViewChild('bg1', { static: true }) bg1!: ElementRef;
	@ViewChild('bg2', { static: true }) bg2!: ElementRef;
	currentBackground: ElementRef | null = null;
	currentClock: any = {
		time: '',
		date: ''
	};
	isLoading: boolean = true;
	bottomWidgets: any[] = [];
	settings = {
		id: '',
		refreshDelay: 60,
		resolution: {
			width: '2880',
			height: '1800'
		},
		unsplash: {
			enabled: false,
			collectionsId: ''
		},
		hass: {
			endpoint: '',
			token: ''
		}
	};

	async ngOnInit() {
		await this.loadSettings();
		this.isLoading = false;
		this.updateClock();
		this.currentBackground = this.bg1;
		this.updateBackground();
		this.updateHAWidgets();

		setInterval(() => this.updateClock(), 750);
		setInterval(() => this.updateBackground(), this.settings.refreshDelay * 1000);
		setInterval(() => this.updateHAWidgets(), 60000);
	}

	async loadWidgets() {
		try {
			const resp = await fetch(`${environment.API.endpoint}/admin/widgets/${this.settings.id}`);
			const respJson = await resp.json();
			this.bottomWidgets = respJson;
		} catch(e) {
			console.log('Error while fetching widgets', e);
		}
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
					collectionsId: respJson?.unsplash?.collectionsId || ''
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

	updateClock() {
		const now = new Date();
		const options: any = { weekday: 'long', month: 'long', day: 'numeric' };
		let dateStr = now.toLocaleDateString('fr-FR', options);
		dateStr = dateStr.replace(/^\w| (\w)/g, match => match.toUpperCase());

		const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
		this.currentClock = { time: timeStr, date: dateStr };
	}

	updateHAWidgets() {
		this.bottomWidgets.forEach(async (widget) => {
			try {
				const resp = await fetch(`${this.settings.hass.endpoint}/api/states/${widget.entityId}`, {
                    headers: {
                        Authorization: `Bearer ${this.settings.hass.token}`
                    }
                });
				const data = await resp?.json();
				widget.value = `${widget.prefix || ''}${data.state}${widget.suffix || ''}`;
			} catch(e: any) {
				widget.value = `Error: ${e.message}`;
			}

		});
	}

	async updateBackground() {
		this.isLoading = true;
		const nextBackground = this.currentBackground === this.bg1 ? this.bg2 : this.bg1;
		let pictureResp = null;
		try {
			if (!this.settings.unsplash.enabled)
				throw new Error('Unsplash is disabled');
			pictureResp = await fetch(`${environment.API.endpoint}/photos/random/${this.settings.id}`);
			const pictureData = await pictureResp.json();
			nextBackground.nativeElement.src = `${pictureData.urls.raw}&w=${this.settings.resolution.width}&h=${this.settings.resolution.height}`;
		} catch(e) {
			console.log('Cannot request Unsplash GW API');
			nextBackground.nativeElement.src = `https://picsum.photos/${this.settings.resolution.width}/${this.settings.resolution.height}?random=${Date.now()}`;
		}

		nextBackground.nativeElement.onload = () => {
			if (this.currentBackground === this.bg1) {
				this.bg1.nativeElement.style.opacity = "0";
				this.bg2.nativeElement.style.opacity = "1";
				this.currentBackground = this.bg2;
			} else {
				this.bg2.nativeElement.style.opacity = "0";
				this.bg1.nativeElement.style.opacity = "1";
				this.currentBackground = this.bg1;
			}
			this.isLoading = false;
		};
	}

}
