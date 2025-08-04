#!/bin/bash

# Script to refactor harnesses from SkyHelpInlinePopoverHarness inheritance to utility function approach
# Usage: ./refactor-help-inline-harness.sh <harness-file-path>

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <harness-file-path>"
    echo "Example: $0 libs/components/tiles/testing/src/modules/tiles/tile-harness.ts"
    exit 1
fi

HARNESS_FILE="$1"

if [ ! -f "$HARNESS_FILE" ]; then
    echo "Error: File $HARNESS_FILE does not exist"
    exit 1
fi

echo "Refactoring $HARNESS_FILE to use utility function approach..."

# Step 1: Update imports
sed -i '' 's/import { SkyHelpInlineHarness } from.*testing.*;//g' "$HARNESS_FILE"
sed -i '' 's/import { SkyHelpInlinePopoverHarness } from.*testing.*;//g' "$HARNESS_FILE"

# Add new imports after first import line
sed -i '' '1a\
import { SkyComponentHarness } from '\''@skyux/core/testing'\'';\
import {\
  clickHelpInline,\
  getHelpPopoverContent,\
  getHelpPopoverTitle,\
  HelpPopoverHarnessMethods,\
} from '\''@skyux/help-inline/testing'\'';
' "$HARNESS_FILE"

# Step 2: Change class declaration
sed -i '' 's/extends SkyHelpInlinePopoverHarness/extends SkyComponentHarness implements HelpPopoverHarnessMethods/g' "$HARNESS_FILE"

# Step 3: Replace clickHelpInline method
sed -i '' '/public async clickHelpInline(): Promise<void> {/,/^  }$/c\
  public async clickHelpInline(): Promise<void> {\
    return await clickHelpInline(this);\
  }\
\
  /**\
   * Gets the help popover content.\
   */\
  public async getHelpPopoverContent(): Promise<string | undefined> {\
    return await getHelpPopoverContent(this);\
  }\
\
  /**\
   * Gets the help popover title.\
   */\
  public async getHelpPopoverTitle(): Promise<string | undefined> {\
    return await getHelpPopoverTitle(this);\
  }
' "$HARNESS_FILE"

# Step 4: Remove unused #getHelpInline method
sed -i '' '/async #getHelpInline(): Promise<SkyHelpInlineHarness> {/,/^  }$/d' "$HARNESS_FILE"

echo "✅ Refactoring complete for $HARNESS_FILE"
echo "Please review the changes and run any necessary tests."
