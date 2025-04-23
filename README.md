# Directory setup

```
Project folder
|___chicago-bike-lane-map <-- Host from this folder
|   |___about.php
|   |___contact.php
|   |___index.php
|   |___...
|
|___paths.json <-- This is where I store info for the bike lanes
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
  "github": "https://github.com/srkovnar/chicago-bike-lane-map",
  "in_progress": false,
  "show_location": false,
  "zoom_location": false,
  "make_path_data_public": true,

  "debug_showOutlines": false,
  "debug_showPoints": false
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

## style.json

As of 2025-04-21, this is also required. I offloaded the map assigning color and formatting for each path type into a separate file

```json
{
  "trail": {
    "layerObject": null,
    "displayName": "Trails",
    "dash": "0",
    "color": "red"
  },
  "pbl": {
    "layerObject": null,
    "displayName": "Protected Bike Lanes",
    "dash": "0",
    "color": "purple"
  },
  "ripbl": {
    "layerObject": null,
    "displayName": "Rapid-Implementation Protected Bike Lanes",
    "dash": "0",
    "color": "#24E"
  },
  "bikeway": {
    "layerObject": null,
    "displayName": "Neighborhood Bikeways ('Greenways')",
    "dash": "0",
    "color": "green"
  },
  "other": {
    "layerObject": null,
    "displayName": "Other connections",
    "dash": "0",
    "color": "gray"
  },
  "break": {
    "layerObject": null,
    "displayName": "------------------"
  },
  "trail_incomplete": {
    "layerObject": null,
    "displayName": "Future Trails",
    "dash": "7",
    "color": "red"
  },
  "pbl_incomplete": {
    "layerObject": null,
    "displayName": "Future Protected Bike Lanes",
    "dash": "7",
    "color": "purple"
  },
  "ripbl_incomplete": {
    "layerObject": null,
    "displayName": "Future Rapid-Implementation Protected Bike Lanes",
    "dash": "7",
    "color": "#24E"
  },
  "bikeway_incomplete": {
    "layerObject": null,
    "displayName": "Future Neighborhood Bikeways ('Greenways')",
    "dash": "7",
    "color": "green"
  }
}
```

### Website Configuration Options

- `github`: A link to your Github page. If present, a link will be added at the top of the page for your Github.
- `make_path_data_public`: Make `paths.json` publicly-accessible on this domain at `/getdata.php`. This will also create a header link for this page with the label "Raw Data".
- `in_progress`: If true, a popup will be shown when the map loads indicating that the map is still unfinished.
- `show_location`: If true, the map will attempt to ask for the user's location. If the user allows location services for this website, a pin will be placed on the map showing their position. This can be helpful, but also a bit annoying.
- `zoom_location`: If true, and if `show_location` is also true, the map will zoom to the user's location once it loads.

### Debug Configuration Options

Plotting out all of the paths is tediuous, and it's easy to make mistakes. I've done my best to set up the `paths.json` in a way where you can easily break paths down into segments for ease of modification, but there are also a couple debug options you can enable in the `config.json` to visualize what's going on.

- `debug_showOutlines` will show you the "hitbox" of your lines. Since Leaflet line objects have single-pixel width, I had to create invisible bubbles around the paths to make clicking on them possible. Turning this option to `true` will make visible these bubbles. You'll have to modify `map.js` to tweak the size of them.
- `debug_showPoints` will place a dot on each individual coordinate present in `paths.json`. This makes it a little easier to identify which coordinates have already been plotted.

## paths.json

paths.json will look something like this:

```json
{
  {
    "name": "Wellington Neighborhood Bikeway",
    "segments": [
      {
        "name": "Segment name here (optional)",
        "coordinates": [
          [41.93570733775486, -87.7123946150148],
          [41.935745740853555, -87.70759355004395]
        ],
      }
    ],
    "type": "bikeway_incomplete"
    "completion": "Between Summer 2022 and Fall 2024",
    "description": "Here is my description of this bike lane. This will appear in the popup.",
    "links": [
      {
        "name": "My test website",
        "address": "https://yourwebsitehere.com"
      }
    ]
  },
  {
    "name": "California Bike Lane, Schubert to George St",
    "segments": [
      {
        "name": "Segment name here (optional)",
        "type": "ripbl",
        "coordinates": [
          [41.934472760272094, -87.69769902281476],
          [41.93029561038914, -87.69757835449403]
        ],
      }
    ]
  },
  ...
  (continue for the rest of your paths)
  ...
}
```


Obviously you're going to have more than two bike lanes. Each bike lane will need to be its own object.

Note that only the `name`, `segments`, `coordinates`, `type`, and `completed` fields are necessary. All other fields will be detected dynamically if they are available, and that information will be formatted and added to the popup that appears when you click on that bike path.
