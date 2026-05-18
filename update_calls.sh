sed -i 's/setAuraLocal(calculateAura(activityData.activity));/setAuraLocal(calculateAura(activityData.activity, activityData.repoCount));/g' app/island/[username]/IslandPageContent.tsx
sed -i 's/setAuraLocal(calculateAura(activityData.activity));/setAuraLocal(calculateAura(activityData.activity, activityData.repoCount));/g' app/HomeContent.tsx
