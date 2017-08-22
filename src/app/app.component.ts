import { Component } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { TS } from 'typescript-linq/TS'

@Component({
	selector: 'my-app',
	templateUrl: './app.component.html',
	styleUrls: ['../../assets/styles/styles.scss'],
})
export class AppComponent {
	
	public get persons(): Person[] {
		return this._data.where(p => 
			(this.position == '' || p.position.toLowerCase().includes(this.position.toLowerCase())) &&
			(this.firstName == '' || p.firstName.toLowerCase().includes(this.firstName.toLowerCase())) &&
			(this.lastName == '' || p.lastName.toLowerCase().includes(this.lastName.toLowerCase())) &&
			(!this._selectedTheories.any() || this._selectedTheories.any(i => p.theories.indexOf(this.theories[i].name) != -1)) &&
			(!this._selectedMethods.any() || this._selectedMethods.any(i => p.methods.indexOf(this.methods[i].name) != -1))
		).toArray();
	};
	
	/**
	 * Filtering fields.
	 */
	public position: string = '';
	public firstName: string = '';
	public lastName: string = '';

	/**
	 * Discovered theories based on imported data.
	 */
	public get theories(): IMultiSelectOption[] {
		var i = 0;
		return this._data.selectMany(p => p.theories)
			.distinct()
			.select(theory => <IMultiSelectOption>{ id: i++, name: theory})
			.toArray();
	}

	/**
	 * Selected theory-indexes from multiselect.
	 */
	public selectedTheories: number[] = [];

	private get _selectedTheories(): TS.Collections.List<number>{
		return new TS.Collections.List<number>(false, this.selectedTheories);
	}

	/**
	 * Discovered methods based on imported data.
	 */
	public get methods(): IMultiSelectOption[] {
		var i = 0;
		return this._data.selectMany(p => p.methods)
			.distinct()
			.select(method => <IMultiSelectOption>{ id: i++, name: method})
			.toArray();
	}

	/** 
	 * Selected method-indexes from multiselect.
	 */
	public selectedMethods: number[] = [];
	
	private get _selectedMethods(): TS.Collections.List<number>{
		return new TS.Collections.List<number>(false, this.selectedMethods);
	}

	/**
	 * Bootstrap Angular 2 multiselect settings.
	 * See also: https://github.com/softsimon/angular-2-dropdown-multiselect
	 */
	public multiselectSettings: any = {
		enableSearch: true,
		showCheckAll: true,
		showUncheckAll: true,
		buttonClasses: 'btn btn-default btn-block',
		dynamicTitleMaxItems: 3
	};

	/**
	 * Underlying data.
	 */
	private _data: TS.Collections.List<Person>;
	
	constructor() {
		this._data = new TS.Collections.List<Person>(false, []);
	}
	
	/**
	 * trigger when a file is selected at input tag
	 */
	fileChanged($event):void {

		//get file
		//need to cast html tag
		//reference： http://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
		let file = (<HTMLInputElement>document.getElementById("file")).files[0];
		
		var fileReader = new FileReader();
		fileReader.readAsText(file);
		
		// try to read file
		fileReader.onload = (e) => {
			let content = (<any>e.target).result;
			this.importCSV(content);
		}
	}
	
	/**
	 * In this importCSV we make the assumption of having the correct format:
	 *  - skipping first 2 lines.
	 *  - exact amount of columns and place of them are accordingly.
	 */
	private importCSV(csv: string){
		const skipHeaderLines = 2
		
		let lines = csv.split('\n');
		let regex = /[^,"]+|"[^"]+"/g
		
		for(let i = 2; i < lines.length; i++)
		{
			let match = lines[i].match(regex);
			if (match == null){
				continue;
			}
			
			let person = {
				position: this.trim(match[0]),
				firstName: this.trim(match[1]),
				lastName: this.trim(match[2]),
				theories: this.trim(match[3]).split(','),
				methods: this.trim(match[4]).split(','),
				contact: this.trim(match[5]),
				website: this.trim(match[6]),
			};
			
			this._data.add(person);
		}
	}

	/**
	 * Trim both ends of the double-quote character.
	 */
	private trim(input: string): string {
		const mask = '"'
		while (~mask.indexOf(input[0])) {
			input = input.slice(1);
		}
		while (~mask.indexOf(input[input.length - 1])) {
			input = input.slice(0, -1);
		}
		return input;
	}
}

export interface Person {
    position: string;
	firstName: string;
	lastName: string;
	theories: string[];
	methods: string[];
    contact: string;
	website: string;
}