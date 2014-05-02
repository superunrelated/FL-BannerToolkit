BannerToolkit
=============

Banner Toolkit for creating and versioning Flash banners fast!

Installation:
Copy the content of the Commands folder to:
/Users/{user}/Library/Application Support/Adobe/Flash CC/en_US/Configuration/Commands/

Tools:
Create versions:
Creates duplicates of your current open document in the sizes you provide. Specify sizes using the formating WWWWxHHHH. All other text in the dialog is ignored.
![](https://github.com/superunrelated/BannerToolkit/docs/images/CreateVersions1.png)

- Found versions gives you a preview of the sizes that will be created.
- Allow smoothing will traverse the entire llibrary and ensure that "Allow Smothing" is on or off for all bitmap assets.
- Resize instaces to stage will traverse all layers and frames on the main timeline and resize instances with the names you proveide. Usefull for buttons and backgrounds.
- Aligns instances to stage. Usefull for logos that always belong in a corner.
![](https://github.com/superunrelated/BannerToolkit/docs/images/CreateVersions2.png)

Publish Fallbacks:
Publish fallbacks creates a deploy directory in the .fla files folder and publishes a .swf and a fallback image to that folder. - - Set fallback frame using a frame label or a frame number on the main timeline.
- Set a specific flash quality setting in precent.
- Set a specifiv JPG quality in percent.
- Choose JPEG and/or GIF fallback.
- Publish size raport outputs the usual Flash File Size Report.
- Allow Smooting turns on Smoothing for all bitmap assets.
Iterative sizing targets:
- Publish to filesize sets a start quality for the file.
- Interval is the quality downgrade for each iteration.
- For each size you can set a target file size in kb. If the target cannot be reached a warning will be displayed in the Output Panel.
![](https://github.com/superunrelated/BannerToolkit/docs/images/PublishFallbacks.png)

