# donation-tracker-graphics
Simple NodeCG graphics that interact with my fork of the GDQ donation tracker.

Currently can show the total (with updates via the repeater) and also incoming donations (received from the repeater).

**Example Configuration:**
```
{
  "trackerURL": "donations.example.com",
  "repeater": {
    "url": "donations.example.com",
    "path": "/repeater/socket.io"
  },
  "eventShort": "example2020"
}
```
