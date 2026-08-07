import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useNavigation() {
  const router = useRouter();
  const route = useRoute();

  const navigationRoutes = computed(() =>
    router
      .getRoutes()
      .filter((item) => item.meta?.protected)
      .map((item) => ({
        path: item.path,
        label: String(item.name),
        icon: item.meta?.icon ?? "mdi-chevron-right",
      })),
  );

  const isProtectedRoute = computed(() => {
    return route.meta?.protected ?? false;
  });

  return { navigationRoutes, isProtectedRoute };
}
