# InAppStory React Native Example

This project demonstrates the basics of integrating and using the InAppStory SDK in a React Native application. It includes examples for stories, reader customization, favorites, banners, in-app messages, games, and other SDK features.

Full documentation for the React Native SDK is available in the [InAppStory documentation](https://docs.inappstory.com/sdk-guides/react-native/).

## Get Started

To run the example application:

1. Clone this repository and open the project directory.
2. Install dependencies:

	```sh
	npm install
	```

3. Set your InAppStory integration key in [`src/config/iasConfig.ts`](src/config/iasConfig.ts) (copy from [`src/config/iasConfig.example.ts`](src/config/iasConfig.example.ts) if it does not exist yet). This file also contains IDs and other settings used by individual examples, such as story, feed, In-App Message, and banner placement IDs.
4. For iOS, install CocoaPods dependencies:

	```sh
	cd ios && pod install && cd ..
	```

5. Run the application:

	- Android:
		```sh
		npm run android
		```
	- iOS:
		```sh
		npm run ios
		```

The Android host is configured to initialize the SDK natively.

## Example Screens

- **Simple integration (Stories feed)** - displays a basic stories feed and opens the reader.
- **Cell customization** - customizes the appearance and layout of story cells.
- **Single story** - opens a story by its ID.
- **Onboarding** - displays onboarding stories.
- **In-App Messaging (IAM)** - shows in-app messages by ID or event.
- **Custom GoodsWidget** - demonstrates a custom product widget in a story.
- **Favorites** - enables favorite stories and displays the favorites list.
- **Banners** - displays banners from a configured placement.
- **Games** - demonstrates interactive games within stories.
- **Product Cart / Checkout** - demonstrates product cart interactions and checkout flow.
- **User switching** - changes the active SDK user.
- **Tags & Placeholders** - demonstrates audience tags and content placeholders.
- **Reader customization** - customizes the story reader appearance and controls.
