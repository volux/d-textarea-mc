# d-textarea-mc

Textarea with multiple cursors. [DerbyJS](http://derbyjs.com/) component.

## Installation

While not release

```
$ npm install volux/d-textarea-mc
```

## Usage
### In app/index.js:

Write your code for user cursor properties (optional, example code present in component):

````javascript
/**
 * @param userId {String}
 * @returns {{label: String, color: String, bgColor: String}}
 */ 
app.proto.cursorPropertiesForUser = function (userId) {
         
    var label = 'intruder'; // :)
    var color = 'rgba(250, 250, 250, .9)';
    var bgColor = 'rgba(200, 0, 0, .9)';
    
    var channel = function (uid, index) {
    
     return uid.charCodeAt(index) + 100;
    };
    
    if (userId) {
    
        // f.e. label = app.model.get('members.' + userId + '.name');
        label = userId.split('-')[0];
        
        var uid = userId.substring(0, 3);
        
        bgColor = 'rgba(' + channel(uid, 0) + ', ' + channel(uid, 1) + ', ' + channel(uid, 2) + ', .9)';
    }
    return {
        label: label,
        color: color,
        bgColor: bgColor
    };
};
````

To use the component pass it to `app.use` as usual.
```javascript
app.use(require('d-textarea-mc'));
```

### Replace your ``textarea`` in template:

````jade
//textarea {{_page.text}}
d-textarea-mc(data="{{_page.text}}" cursors="{{_page.textCursors}}" userId="{{_session.userId}}")
````

````html
<!--<textarea>{{_page.text}}</textarea>-->
<view is="d-textarea-mc" data="{{_page.text}}" cursors="{{_page.textCursors}}" userId="{{_session.userId}}"></view>
````

Collection ``_page.textCursors`` must be unique for ``_page.text``.

## Demo

[Live demo](https://d-textarea-mc.sockeye.cc/). [Demo repo](https://github.com/volux/d-textarea-mc-demo)

## Issues

Reposition cursors on resize

## MIT License
Copyright (c) 2015 by Andrey Skulov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.