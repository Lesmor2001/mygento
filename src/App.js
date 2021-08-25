import './App.scss';
import React from "react";
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { RadioButtonComponent, CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { L10n } from '@syncfusion/ej2-base';
import './scss/fileUpload.scss';


class Form extends React.Component {
	constructor(props) {
		super(props);
		this.settings = { effect: 'Zoom', duration: 400, delay: 0 };
		L10n.load({
			"ru": {
				"uploader": {
					"Browse": "",
					"Clear": "",
					"Upload": "",
					"cancel": "",
					"delete": "",
					"dropFilesHint": "Загрузить резюме",
					"inProgress": "",
					"invalidFileType": "",
					"invalidMaxFileSize": " загружайте файл размером не более 16 mb",
					"invalidMinFileSize": "",
					"readyToUploadMessage": "",
					"remove": "",
					"removedFailedMessage": "",
					"removedSuccessMessage": "",
					"uploadFailedMessage": "",
					"uploadSuccessMessage": "",
				}
			}
		})

		this.asyncSettings = {
			saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
			removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
		};

		this.state = {
			fields: {
				name: "",
				surname: "",
				email: "",
				gender: "",
				link: "",
				agreement: false
			},
			errors: {},
		}


		this.textBoxes = [{
			name: "name",
			label: "Имя *",
			placeholder: "Имя",
			type: "text"
		},
		{
			name: "surname",
			label: "Фамилия *",
			placeholder: "Фамилия",
			type: "text"
		},
		{
			name: "email",
			label: "Электронная почта *",
			placeholder: "Электронная почта",
			type: "email"
		}
		];

		this.buttons = [
			{
				buttonModel: {
					content: 'Понятно',
					cssClass: 'mygento__btn mygento__btn_modal'
				},
				'click': () => {
					this.dialogInstance.hide();
					this.dialogInstance1.hide();
				}
			}];

		this.handleChange = this.handleChange.bind(this);
	}

	handleValidation(fieldName, type) {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		//Name
		if (!fields["name"]) {
			formIsValid = false;
			errors["name"] = "Заполните данное поле";
		}

		if (typeof fields["name"] !== "undefined") {
			if (!fields["name"].match(/^[a-zа-яё\s]+$/iu)) {
				formIsValid = false;
				errors["name"] = "В имени могут быть только буквы";
			}
		}

		//Surname
		if (!fields["surname"]) {
			formIsValid = false;
			errors["surname"] = "Заполните данное поле";
		}

		if (typeof fields["surname"] !== "undefined") {
			if (!fields["surname"].match(/^[a-zа-яё\s]+$/iu)) {
				formIsValid = false;
				errors["surname"] = "В имени могут быть только буквы";
			}
		}

		//Email
		if (!fields["email"]) {
			formIsValid = false;
			errors["email"] = "Заполните данное поле";
		}

		//Gender
		if (!fields["gender"]) {
			formIsValid = false;
			errors["gender"] = "Укажите пол";
		}

		//Agreement
		if (!fields["agreement"]) {
			formIsValid = false;
			errors["agreement"] = "Ознакомьтесь с политикой и отметьте данное поле";
		}

		if (typeof fields["email"] !== "undefined") {
			let lastAtPos = fields["email"].lastIndexOf('@');
			let lastDotPos = fields["email"].lastIndexOf('.');

			if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
				formIsValid = false;
				errors["email"] = "Пожалуйста укажите электронную почту";
			}
		}



		this.setState({ errors: errors });
		return formIsValid;
	}

	contactSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			this.handleClick(this.dialogInstance1)
			this.setState({
				fields: {
					name: "",
					surname: "",
					email: "",
					gender: "",
					link: "",
					agreement: false
				}
			})
			this.uploadObj.remove()
		}
	}


	handleChange(field, e) {

		let fields = this.state.fields;
		if (field === "file") {
			fields[field] = e;
		} else {
			if (field === "agreement") {
				fields[field] = e.target.checked;
			} else { fields[field] = e.target.value; }

		}

		this.setState({ fields });
	}
	dialogClose(target) {
		target.hide();
	};

	handleClick(target) {
		target.show();
	}

	onSuccess(args) {
		this.handleChange('file', args.file.name)

	}

	onSelected(args) {
		document.getElementsByClassName('e-file-select-wrap')[0].style.display = 'none';
	}

	onRemoving(args) {
		document.getElementsByClassName('e-file-select-wrap')[0].style.display = 'flex';
	}



	render() {
		const textboxes = this.textBoxes.map(el => (
			<div className="mygento__input_text" key={el.name} >
				<label htmlFor="">{el.label}</label>
				<TextBoxComponent cssClass={this.state.errors[el.name] !== undefined ? "mygento__input_text_error" : "mygento__input_text_valid"} onChange={this.handleChange.bind(this, el.name)} value={this.state.fields[el.name]} placeholder={el.placeholder} type={el.type} floatLabelType="Never" />
				<span className="error">{this.state.errors[el.name]}</span>
			</div>
		))
		return (
			<form onSubmit={this.contactSubmit.bind(this)}>
				<h1>Анкета соискателя</h1>
				<h2>Личные данные</h2>
				<div className="mygento__personal">
					{textboxes}
					<div className='control-pane' ref={this.dropContainerRef}>
						<div className='control-section uploadpreview'>
							<div id='dropArea' className='dropArea' ref={this.dropRef}>
								<UploaderComponent cssClass="mygento__input_file"
									id='fileUpload'
									asyncSettings={this.asyncSettings}
									ref={(scope) => { this.uploadObj = scope; }}
									dropArea={this.dropElement}
									locale="ru"
									selected={this.onSelected.bind(this)}
									removing={this.onRemoving.bind(this)}
									success={this.onSuccess.bind(this)}
									maxFileSize={16000000}
								></UploaderComponent>
							</div>
						</div>
					</div>
				</div>
				<h2>Пол * <span className="error_gender">{this.state.errors['gender']}</span> </h2>
				<div className="row">
					<RadioButtonComponent checked={this.state.fields.gender === 'male'} onChange={this.handleChange.bind(this, 'gender')} cssClass="mygento__input_radio" label='Мужской' name='gender' value="male"></RadioButtonComponent>
					<RadioButtonComponent checked={this.state.fields.gender === 'female'} onChange={this.handleChange.bind(this, 'gender')} cssClass="mygento__input_radio" label='Женский' name='gender' value="female"></RadioButtonComponent>
				</div>
				<h2>Github</h2>

				<div className="mygento__input_text" >
					<label htmlFor="">Вставьте ссылку на Github</label>
					<TextBoxComponent placeholder="Вставьте ссылку на Github" cssClass={this.state.errors["link"] !== undefined ? "mygento__input_text_error" : "mygento__input_text_valid"} onChange={this.handleChange.bind(this, "link")} value={this.state.fields["link"]} type="text" floatLabelType="Never" />
				</div>


				<div className="mygento__input_checkbox">
					<CheckBoxComponent onChange={this.handleChange.bind(this, 'agreement')} name="agreement" id="agreement" checked={this.state.fields.agreement}></CheckBoxComponent>
					<label htmlFor="agreement"> * Я согласен с <a href="#" role="button" onClick={() => this.handleClick(this.dialogInstance)}>политикой конфиденциальности</a></label>
					<span className="error error_agreement">{this.state.errors["agreement"]}</span>
				</div>


				<ButtonComponent cssClass='mygento__btn' type="submit"
					disabled={(this.state.fields.agreement &&
						this.state.fields.name.length > 0 &&
						this.state.fields.surname.length > 0 &&
						this.state.fields.gender.length > 0 &&
						this.state.fields.email.length > 0) ? false : true}
				>Отправить</ButtonComponent>


				<DialogComponent
					ref={dialog => this.dialogInstance1 = dialog}
					cssClass="mygento__modal mygento__modal_success"
					// width='550px'
					animationSettings={this.settings}
					target='body' showCloseIcon={true}
					close={() => this.dialogClose(this.dialogInstance1)}
					isModal={true}
					visible={false}
					header={`Спасибо ${this.state.fields.name} !	`}
					content="Мы скоро свяжемся с Вами"
					buttons={this.buttons}
					overlayClick={() => this.dialogClose(this.dialogInstance1)} >
				</DialogComponent>

				<DialogComponent
					ref={dialog => this.dialogInstance = dialog}
					cssClass="mygento__modal mygento__modal_policy"
					// width='760px'
					animationSettings={this.settings}
					target='body'
					showCloseIcon={true}
					close={() => this.dialogClose(this.dialogInstance)}
					isModal={true}
					visible={false}
					header="Политика конфиденциальности"
					content="1. Общие положения
					Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые Михайловым Иваном Сергеевичем (далее – Оператор).
					1.1. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.
					1.2. Настоящая политика Оператора в отношении обработки персональных данных (далее – Политика) применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта httpsː//thismywebsite·com.
					 
					2. Основные понятия, используемые в Политике
					2.1. Автоматизированная обработка персональных данных – обработка персональных данных с помощью средств вычислительной техники;
					2.2. Блокирование персональных данных – временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных);
					2.3. Веб-сайт – совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, обеспечивающих их доступность в сети интернет по сетевому адресу httpsː//thismywebsite·com;
					2.4. Информационная система персональных данных — совокупность содержащихся в базах данных персональных данных, и обеспечивающих их обработку информационных технологий и технических средств;
					2.5. Обезличивание персональных данных — действия, в результате которых невозможно определить без использования дополнительной информации принадлежность персональных данных конкретному Пользователю или иному субъекту персональных данных;
					2.6. Обработка персональных данных – любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных;
					2.7. Оператор – государственный орган, муниципальный орган, юридическое или физическое лицо, самостоятельно или совместно с другими лицами организующие и (или) осуществляющие обработку персональных данных, а также определяющие цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными;
					2.8. Персональные данные – любая информация, относящаяся прямо или косвенно к определенному или определяемому Пользователю веб-сайта httpsː//thismywebsite·com;
					2.9. Пользователь – любой посетитель веб-сайта httpsː//thismywebsite·com;
					2.10. Предоставление персональных данных – действия, направленные на раскрытие персональных данных определенному лицу или определенному кругу лиц;
					2.11. Распространение персональных данных – любые действия, направленные на раскрытие персональных данных неопределенному кругу лиц (передача персональных данных) или на ознакомление с персональными данными неограниченного круга лиц, в том числе обнародование персональных данных в средствах массовой информации, размещение в информационно-телекоммуникационных сетях или предоставление доступа к персональным данным каким-либо иным способом;
					2.12. Трансграничная передача персональных данных – передача персональных данных на территорию иностранного государства органу власти иностранного государства, иностранному физическому или иностранному юридическому лицу;
					2.13. Уничтожение персональных данных – любые действия, в результате которых персональные данные уничтожаются безвозвратно с невозможностью дальнейшего восстановления содержания персональных данных в информационной системе персональных данных и (или) уничтожаются материальные носители персональных данных.
					 
					3. Оператор может обрабатывать следующие персональные данные Пользователя
					3.1. Фамилия, имя, отчество;
					3.2. Номер телефона;
					3.3. Адрес электронной почты;
					3.4. Также на сайте происходит сбор и обработка обезличенных данных о посетителях (в т.ч. файлов «cookie») с помощью сервисов интернет-статистики (Яндекс Метрика и Гугл Аналитика и других).
					3.5. Вышеперечисленные данные далее по тексту Политики объединены общим понятием Персональные данные.
					 
					4. Цели обработки персональных данных
					4.1. Цель обработки персональных данных Пользователя — заключение, исполнение и прекращение гражданско-правовых договоров; предоставление доступа Пользователю к сервисам, информации и/или материалам, содержащимся на веб-сайте httpsː//thismywebsite·com; уточнение деталей заказа.
					4.2. Также Оператор имеет право направлять Пользователю уведомления о новых продуктах и услугах, специальных предложениях и различных событиях. Пользователь всегда может отказаться от получения информационных сообщений, направив Оператору письмо на адрес электронной почты privacy@thismywebsite·com с пометкой «Отказ от уведомлений о новых продуктах и услугах и специальных предложениях».
					4.3. Обезличенные данные Пользователей, собираемые с помощью сервисов интернет-статистики, служат для сбора информации о действиях Пользователей на сайте, улучшения качества сайта и его содержания.
					 
					5. Правовые основания обработки персональных данных
					5.1. Оператор обрабатывает персональные данные Пользователя только в случае их заполнения и/или отправки Пользователем самостоятельно через специальные формы, расположенные на сайте httpsː//thismywebsite·com. Заполняя соответствующие формы и/или отправляя свои персональные данные Оператору, Пользователь выражает свое согласие с данной Политикой.
					5.2. Оператор обрабатывает обезличенные данные о Пользователе в случае, если это разрешено в настройках браузера Пользователя (включено сохранение файлов «cookie» и использование технологии JavaScript).
					 
					6. Порядок сбора, хранения, передачи и других видов обработки персональных данных
					Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер, необходимых для выполнения в полном объеме требований действующего законодательства в области защиты персональных данных.
					6.1. Оператор обеспечивает сохранность персональных данных и принимает все возможные меры, исключающие доступ к персональным данным неуполномоченных лиц.
					6.2. Персональные данные Пользователя никогда, ни при каких условиях не будут переданы третьим лицам, за исключением случаев, связанных с исполнением действующего законодательства.
					6.3. В случае выявления неточностей в персональных данных, Пользователь может актуализировать их самостоятельно, путем направления Оператору уведомление на адрес электронной почты Оператора privacy@thismywebsite·com с пометкой «Актуализация персональных данных».
					6.4. Срок обработки персональных данных является неограниченным. Пользователь может в любой момент отозвать свое согласие на обработку персональных данных, направив Оператору уведомление посредством электронной почты на электронный адрес Оператора privacy@thismywebsite·com с пометкой «Отзыв согласия на обработку персональных данных».
					 
					7. Трансграничная передача персональных данных
					7.1. Оператор до начала осуществления трансграничной передачи персональных данных обязан убедиться в том, что иностранным государством, на территорию которого предполагается осуществлять передачу персональных данных, обеспечивается надежная защита прав субъектов персональных данных.
					7.2. Трансграничная передача персональных данных на территории иностранных государств, не отвечающих вышеуказанным требованиям, может осуществляться только в случае наличия согласия в письменной форме субъекта персональных данных на трансграничную передачу его персональных данных и/или исполнения договора, стороной которого является субъект персональных данных.
					 
					8. Заключительные положения
					8.1. Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты privacy@thismywebsite·com.
					8.2. В данном документе будут отражены любые изменения политики обработки персональных данных Оператором. Политика действует бессрочно до замены ее новой версией.
					8.3. Актуальная версия Политики в свободном доступе расположена в сети Интернет по адресу httpsː//thismywebsite·com/privacy/."
					buttons={this.buttons}
					overlayClick={() => this.dialogClose(this.dialogInstance)} >
				</DialogComponent>

			</form>
		)
	}
}

function App() {
	return (
		<div className="mygento">
			<Form />
		</div>
	);
}

export default App;
