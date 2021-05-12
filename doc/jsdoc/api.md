<a name="ScheduleController"></a>

## ScheduleController
Клас-контролер маршрутів розкладу

**Kind**: global class  

* [ScheduleController](#ScheduleController)
    * [.getGroups(req, res)](#ScheduleController+getGroups) ⇒ <code>json</code>
    * [.getGroupLessons(req, res)](#ScheduleController+getGroupLessons) ⇒ <code>json</code>
    * [.getGroupTimetable(req, res)](#ScheduleController+getGroupTimetable) ⇒ <code>json</code>
    * [.getTeachers(req, res)](#ScheduleController+getTeachers) ⇒ <code>json</code>
    * [.getTeacherLessons(req, res)](#ScheduleController+getTeacherLessons) ⇒ <code>json</code>
    * [.getTeacherTimetable(req, res)](#ScheduleController+getTeacherTimetable) ⇒ <code>json</code>

<a name="ScheduleController+getGroups"></a>

### scheduleController.getGroups(req, res) ⇒ <code>json</code>
Повертає список усіх груп (з обмеженням 500 за замовчуванням)

**Kind**: instance method of [<code>ScheduleController</code>](#ScheduleController)  
**Returns**: <code>json</code> - response - Список груп  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | об'єкт Express запиту |
| res | <code>Object</code> | об'єкт Express відповіді |

<a name="ScheduleController+getGroupLessons"></a>

### scheduleController.getGroupLessons(req, res) ⇒ <code>json</code>
Повертає список занять для конкретної групи

**Kind**: instance method of [<code>ScheduleController</code>](#ScheduleController)  
**Returns**: <code>json</code> - response - Список занять  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | об'єкт Express запиту |
| res | <code>Object</code> | об'єкт Express відповіді |

<a name="ScheduleController+getGroupTimetable"></a>

### scheduleController.getGroupTimetable(req, res) ⇒ <code>json</code>
Повертає ієрархічно впорядкований розклад для конкретної групи

**Kind**: instance method of [<code>ScheduleController</code>](#ScheduleController)  
**Returns**: <code>json</code> - response - Список занять  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | об'єкт Express запиту |
| res | <code>Object</code> | об'єкт Express відповіді |

<a name="ScheduleController+getTeachers"></a>

### scheduleController.getTeachers(req, res) ⇒ <code>json</code>
Повертає список усіх викладачів (з обмеженням 500 за замовчуванням)

**Kind**: instance method of [<code>ScheduleController</code>](#ScheduleController)  
**Returns**: <code>json</code> - response - Список груп  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | об'єкт Express запиту |
| res | <code>Object</code> | об'єкт Express відповіді |

<a name="ScheduleController+getTeacherLessons"></a>

### scheduleController.getTeacherLessons(req, res) ⇒ <code>json</code>
Повертає список занять для конкретного виклада

**Kind**: instance method of [<code>ScheduleController</code>](#ScheduleController)  
**Returns**: <code>json</code> - response - Список занять  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | об'єкт Express запиту |
| res | <code>Object</code> | об'єкт Express відповіді |

<a name="ScheduleController+getTeacherTimetable"></a>

### scheduleController.getTeacherTimetable(req, res) ⇒ <code>json</code>
Повертає ієрархічно впорядкований розклад для конкретного викладача

**Kind**: instance method of [<code>ScheduleController</code>](#ScheduleController)  
**Returns**: <code>json</code> - response - Список занять  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | об'єкт Express запиту |
| res | <code>Object</code> | об'єкт Express відповіді |

