import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/src/components/AppBackground';
import { FoodImage } from '@/src/components/FoodImage';
import { SFIcon } from '@/src/components/SFIcon';
import { getFoodById } from '@/src/data/loadFoods';
import { CATEGORY_LABELS, SLOT_ORDER } from '@/src/data/types';
import {
  loadSavedMeals,
  removeSavedMeal,
  type SavedMeal,
} from '@/src/features/saved/savedMeals';
import * as feedback from '@/src/features/spin/feedback';
import {
  colors,
  gradients,
  radii,
  spacing,
  typography,
} from '@/src/theme/tokens';

const dateFormat = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState<SavedMeal[] | null>(null);

  useEffect(() => {
    loadSavedMeals().then(setSaved);
  }, []);

  const remove = useCallback(async (key: string) => {
    feedback.holdToggled();
    setSaved((prev) => prev?.filter((entry) => entry.key !== key) ?? prev);
    await removeSavedMeal(key);
  }, []);

  if (saved === null) {
    return <AppBackground />;
  }

  return (
    <AppBackground>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <SavedRow entry={item} onDelete={() => remove(item.key)} />
        )}
      />
    </AppBackground>
  );
}

function SavedRow({
  entry,
  onDelete,
}: {
  entry: SavedMeal;
  onDelete: () => void;
}) {
  const foods = SLOT_ORDER.map((category, index) => ({
    category,
    food: getFoodById(entry.ids[index]),
  }));
  const names = foods.map(({ food }) => food?.name ?? '?').join(', ');

  return (
    <Animated.View
      style={styles.card}
      exiting={FadeOut.duration(180)}
      layout={LinearTransition.duration(220)}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{dateFormat.format(entry.savedAt)}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${names} löschen`}
          onPress={onDelete}
          hitSlop={10}
          style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
          <SFIcon name="trash" size={18} color={colors.textMuted} />
        </Pressable>
      </View>
      <View style={styles.foods} accessible accessibilityLabel={names}>
        {foods.map(({ category, food }) => (
          <View key={category} style={styles.food}>
            <Text style={styles.category} numberOfLines={1}>
              {CATEGORY_LABELS[category]}
            </Text>
            <View style={styles.foodFace}>
              {food ? (
                <FoodImage
                  imageKey={food.imageKey}
                  emoji={food.emoji}
                  name={food.name}
                  size={52}
                />
              ) : null}
              <Text style={styles.foodName} numberOfLines={2}>
                {food?.name ?? 'Unbekannt'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <SFIcon name="bookmark" size={34} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>Noch nichts gespeichert</Text>
      <Text style={styles.emptyText}>
        Tippe nach einem Dreh auf das Lesezeichen neben Spin, um eine
        Kombination hier abzulegen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    gap: spacing.md,
    flexGrow: 1,
  },
  /** Same metal-and-inset language as the machine. */
  card: {
    padding: spacing.sm + 2,
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundImage: gradients.cabinet,
    boxShadow: [
      'inset 0 2px 0 rgba(255, 255, 255, 0.9)',
      'inset 0 -4px 8px rgba(40, 28, 60, 0.4)',
      '0 12px 24px rgba(14, 8, 22, 0.45)',
    ].join(', '),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  date: {
    ...typography.label,
    color: colors.inkMuted,
  },
  delete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cabinetInset,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  foods: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs + 2,
    borderRadius: radii.md,
    backgroundColor: colors.cabinetInset,
    boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.75)',
  },
  food: {
    flex: 1,
    gap: spacing.xs,
  },
  category: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },
  foodFace: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm + 2,
    backgroundImage: `linear-gradient(to right, #CFC8DA 0%, ${colors.reelFace} 22%, #FFFFFF 50%, ${colors.reelFace} 78%, #CFC8DA 100%)`,
  },
  foodName: {
    ...typography.foodName,
    fontSize: 13,
    color: colors.ink,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
