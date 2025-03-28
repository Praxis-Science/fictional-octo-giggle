mkdir -p temp-next && cd temp-next && echo "yes
yes
yes
yes
no
no
yes" | npx create-next-app@14 . --typescript --tailwind --eslint && cd .. && cp -r temp-next/* . && cp temp-next/.* . 2>/dev/null || true && rm -rf temp-next
