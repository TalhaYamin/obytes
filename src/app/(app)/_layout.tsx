import { Link, Redirect, Tabs } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';

import { Pressable, Text } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
  Video as VideoIcon,
} from '@/components/ui/icons';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

/** Short grace in case a future async hydrate leaves status `idle` briefly on first paint. */
const IDLE_RESOLVE_MS = 400;

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const [idleGraceDone, setIdleGraceDone] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIdleGraceDone(true), IDLE_RESOLVE_MS);
    return () => clearTimeout(timer);
  }, []);

  const effectiveStatus
    = status === 'idle' && !idleGraceDone ? 'idle' : status === 'idle' ? 'signOut' : status;

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (effectiveStatus === 'signOut') {
    return <Redirect href="/login" />;
  }
  if (effectiveStatus === 'idle') {
    return null;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          headerRight: () => <CreateNewPostLink />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          title: 'Video',
          tabBarIcon: ({ color }) => <VideoIcon color={color} />,
          tabBarButtonTestID: 'video-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

function CreateNewPostLink() {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
}
