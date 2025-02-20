# Directory setup

```
Project folder
|___chicago-bike-lane-map <-- Host from this folder
|   |___about.php
|   |___contact.php
|   |___index.php
|   |___...
|
|___paths.json <-- This is where I store info for the bike lanes**
|___config.json <-- This stores info for the website - map parameters, mailing info, etc.
```

## config.json

`config.json` will need to look like this:

```json
{
  "mail":
  {
    "smtp_server": "smtp.your_email_host.com",
    "smtp_username": "contact@yourdomain.net",
    "smtp_password": "yourSecurePassword",
    "port": 465,
    "security": "ssl",
    "destination": "contact@yourdomain.net"
  },
  "in_progress": true,
  "show_location": true
}
```

All parameters show above are mandatory for proper functioning of the website.

You will have to configure your own mail parameters based on the mailing service you are using. Most website hosting services will include a free email address that you can use for the contact form along with your subscription to their platform. You might have to do a bit of digging to figure out how to set things up, but most of the information should be pretty straightforward:
- `smtp_server`: The server where you are hosting the email address that is *sending* the email.
  - If you are using a website hosting service, this will be the address of their email server.
- `smtp_username`: The username for the email that will be *sending* the email. You MUST own this email.
- `smtp_password`: The password that corresponds to the email given in `smtp_username`.
- `port`: Usually 465, may depend on your hosting service.
- `security`: This is usually ssl. Like the port, you might have to double-check.
- `destination`: If you want automatically-generated emails to be redirected to a different inbox, you can specify that here. Sometimes this is useful for practical purposes - you may want to have an unmonitored email address that is linked to your website's domain, and another, easier-to-access account (like a Gmail) that you can actually reply from. But this is not necessary and is up to personal preference.. Otherwise, leave it the same as `smtp_username`.

**PLEASE NOTE:** You may be confused that the address *sending* the email is the one that you have access to. Shouldn't it be the other way around? The answer is no. You cannot send emails from someone else's email address, but what you *can* do is alter the "ReplyTo" property on the email. The automatically-generated email that shows up in your inbox will be both sent and received by you, but when you click "Reply", it will put in the email of the user who submitted the contact form.

## paths.json

paths.json will look something like this:

```json
{
  {
    "name": "Wellington Neighborhood Bikeway",
    "coordinates": [
      [41.93570733775486, -87.7123946150148],
      [41.935745740853555, -87.70759355004395]
    ],
    "type": "Neighborhood Bikeway",
    "completed": true,
    "completion": "Between Summer 2022 and Fall 2024",
    "description": "Here is my description of this bike lane. This will appear in the popup.",
    "links": [
      {
        "name": "My test website",
        "address": "https://yourwebsitehere.com"
      }
    ],
    "start": "Kimball",
    "end": "Kedzie"
  },
  {
    "name": "California Bike Lane, Schubert to George St",
    "coordinates": [
      [41.934472760272094, -87.69769902281476],
      [41.93029561038914, -87.69757835449403]
    ],
    "type": "RIPBL",
    "completed": true
  }
}
```


Obviously you're going to have more than two bike lanes. Each bike lane will need to be its own object.

Note that only the `name`, `coordinates`, `type`, and `completed` fields are necessary. All other fields will be detected dynamically if they are available, and that information will be formatted and added to the popup that appears when you click on that bike path.

# Other bits of info

Example of how to create a line manually, including setting a custom color (default is blue) and a dashed line pattern (set to zero or omit to create a solid line)

```javascript
// Example manually-created line - delete later!
var my_line = L.polyline([
  [41.871837956205496, -87.64132180389926],
  [41.88142417791501, -87.63119378302333]
],{
  color: "red",
  dashArray: "20, 20"
}).bindPopup(
  "a red one!"
).addTo(path_layer_2);
```
