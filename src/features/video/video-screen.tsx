import type { AVPlaybackStatus } from 'expo-av';
import { ResizeMode, Video } from 'expo-av';
import * as React from 'react';
import { Platform, Pressable } from 'react-native';

import { FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';

const SUGGESTED_VIDEOS = [
  {
    id: '1',
    title: 'React Native Beginner Tutorial',
    channel: 'Obytes Academy',
    duration: '12:41',
  },
  {
    id: '2',
    title: 'Expo Router in 10 Minutes',
    channel: 'Mobile Dev Labs',
    duration: '10:05',
  },
  {
    id: '3',
    title: 'Build YouTube UI in React Native',
    channel: 'Code Learners',
    duration: '18:22',
  },
];

const DEMO_VIDEO_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const DEMO_YOUTUBE_ID = 'aqz-KE-bpKQ'; // Big Buck Bunny (public)

function YouTubeLikePlayer({
  videoRef,
  onPlaybackStatusUpdate,
}: {
  videoRef: React.RefObject<Video | null>;
  onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void;
}) {
  return Platform.OS === 'web'
    ? (
        <View
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            backgroundColor: 'black',
          }}
        >
          <iframe
            title="YouTube player"
            src={`https://www.youtube-nocookie.com/embed/${DEMO_YOUTUBE_ID}?rel=0&modestbranding=1`}
            style={{ width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </View>
      )
    : (
        <Video
          ref={videoRef}
          source={{ uri: DEMO_VIDEO_URL }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            backgroundColor: 'black',
          }}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      );
}

function UpNextList() {
  return (
    <>
      <Text className="mt-7 text-base font-semibold">Up next</Text>
      {SUGGESTED_VIDEOS.map(video => (
        <View key={video.id} className="mt-4 flex-row gap-3">
          <View className="h-24 w-40 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800">
            <Text className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              {video.duration}
            </Text>
          </View>
          <View className="flex-1">
            <Text numberOfLines={2} className="font-semibold">{video.title}</Text>
            <Text className="mt-1 text-xs text-neutral-500">{video.channel}</Text>
            <Text className="mt-1 text-xs text-neutral-500">Recommended for you</Text>
          </View>
        </View>
      ))}
    </>
  );
}

export function VideoScreen() {
  const videoRef = React.useRef<Video>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const onPlaybackStatusUpdate = React.useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  }, []);

  const togglePlay = React.useCallback(async () => {
    const current = videoRef.current;
    if (!current)
      return;
    if (isPlaying) {
      await current.pauseAsync();
    }
    else {
      await current.playAsync();
    }
  }, [isPlaying]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FocusAwareStatusBar />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mx-auto w-full max-w-4xl pb-8">
          <View className="bg-black">
            <YouTubeLikePlayer
              videoRef={videoRef}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
          </View>

          <View className="px-4 pt-4">
            <Text className="text-xl font-bold">Build a YouTube style player in React Native</Text>
            <Text className="mt-1 text-sm text-neutral-500">78K views • 2 days ago</Text>

            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="size-10 items-center justify-center rounded-full bg-red-600">
                  <Text className="font-bold text-white">OA</Text>
                </View>
                <View>
                  <Text className="font-semibold">Obytes Academy</Text>
                  <Text className="text-sm text-neutral-500">124K subscribers</Text>
                </View>
              </View>
              <Pressable className="rounded-full bg-red-600 px-4 py-2">
                <Text className="font-semibold text-white">Subscribe</Text>
              </Pressable>
            </View>

            <View className="mt-4 flex-row gap-2">
              <Pressable className="rounded-full bg-neutral-200 px-4 py-2 dark:bg-neutral-800">
                <Text>👍 Like</Text>
              </Pressable>
              <Pressable className="rounded-full bg-neutral-200 px-4 py-2 dark:bg-neutral-800">
                <Text>🔁 Share</Text>
              </Pressable>
              <Pressable
                className="rounded-full bg-neutral-900 px-4 py-2 dark:bg-white"
                onPress={togglePlay}
              >
                <Text className="font-semibold text-white dark:text-black">
                  {isPlaying ? 'Pause' : 'Play'}
                </Text>
              </Pressable>
            </View>

            <View className="mt-6 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
              <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                In this lesson, we build a YouTube-like video screen with Expo Router,
                reusable components, and a responsive player layout.
              </Text>
            </View>

            <UpNextList />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
