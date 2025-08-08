-- Enable RLS on all missing tables
ALTER TABLE front_matter_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE front_matter_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscript_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscript_acts ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Enable public access to manuscript_boxes" ON manuscript_boxes;
DROP POLICY IF EXISTS "Enable public access to manuscript_chapters" ON manuscript_chapters;
DROP POLICY IF EXISTS "Enable public access to matter_templates" ON matter_templates;
DROP POLICY IF EXISTS "Enable public access to book_parts" ON book_parts;
DROP POLICY IF EXISTS "Users can manage their own project files" ON project_files;
DROP POLICY IF EXISTS "Allow users to insert project files" ON project_files;
DROP POLICY IF EXISTS "Allow users to view project files" ON project_files;
DROP POLICY IF EXISTS "Public access for manuscript files" ON manuscript_files;

-- Create secure RLS policies for front matter
CREATE POLICY "Users can view front matter options for their books" ON front_matter_options
  FOR SELECT USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can create front matter options for their books" ON front_matter_options
  FOR INSERT WITH CHECK (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can update front matter options for their books" ON front_matter_options
  FOR UPDATE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete front matter options for their books" ON front_matter_options
  FOR DELETE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can view front matter content for their books" ON front_matter_content
  FOR SELECT USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can create front matter content for their books" ON front_matter_content
  FOR INSERT WITH CHECK (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can update front matter content for their books" ON front_matter_content
  FOR UPDATE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete front matter content for their books" ON front_matter_content
  FOR DELETE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

-- Create secure RLS policies for writing progress
CREATE POLICY "Users can view their own writing progress" ON writing_progress
  FOR SELECT USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own writing progress" ON writing_progress
  FOR INSERT WITH CHECK (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own writing progress" ON writing_progress
  FOR UPDATE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own writing progress" ON writing_progress
  FOR DELETE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

-- Create secure RLS policies for manuscript goals
CREATE POLICY "Users can view goals for their books" ON manuscript_goals
  FOR SELECT USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can create goals for their books" ON manuscript_goals
  FOR INSERT WITH CHECK (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can update goals for their books" ON manuscript_goals
  FOR UPDATE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete goals for their books" ON manuscript_goals
  FOR DELETE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

-- Create secure RLS policies for manuscript acts
CREATE POLICY "Users can view acts for their books" ON manuscript_acts
  FOR SELECT USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can create acts for their books" ON manuscript_acts
  FOR INSERT WITH CHECK (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can update acts for their books" ON manuscript_acts
  FOR UPDATE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete acts for their books" ON manuscript_acts
  FOR DELETE USING (book_id IN (SELECT id FROM books WHERE user_id = auth.uid()));

-- Create secure RLS policies for manuscript boxes and chapters
CREATE POLICY "Users can view boxes for their book chapters" ON manuscript_boxes
  FOR SELECT USING (chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid())));

CREATE POLICY "Users can create boxes for their book chapters" ON manuscript_boxes
  FOR INSERT WITH CHECK (chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid())));

CREATE POLICY "Users can update boxes for their book chapters" ON manuscript_boxes
  FOR UPDATE USING (chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid())));

CREATE POLICY "Users can delete boxes for their book chapters" ON manuscript_boxes
  FOR DELETE USING (chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid())));

-- Secure project files with proper ownership checks
CREATE POLICY "Users can view their project files" ON project_files
  FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can upload files to their projects" ON project_files
  FOR INSERT WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their project files" ON project_files
  FOR UPDATE USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their project files" ON project_files
  FOR DELETE USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Secure manuscript files with proper ownership
CREATE POLICY "Users can view manuscript files for their chapters" ON manuscript_files
  FOR SELECT USING (box_id IN (SELECT box_id FROM manuscript_boxes WHERE chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid()))));

CREATE POLICY "Users can upload manuscript files for their chapters" ON manuscript_files
  FOR INSERT WITH CHECK (box_id IN (SELECT box_id FROM manuscript_boxes WHERE chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid()))));

CREATE POLICY "Users can update manuscript files for their chapters" ON manuscript_files
  FOR UPDATE USING (box_id IN (SELECT box_id FROM manuscript_boxes WHERE chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid()))));

CREATE POLICY "Users can delete manuscript files for their chapters" ON manuscript_files
  FOR DELETE USING (box_id IN (SELECT box_id FROM manuscript_boxes WHERE chapter_id IN (SELECT chapter_id FROM manuscript_chapters WHERE book_id IN (SELECT id FROM books WHERE user_id = auth.uid()))));

-- Make matter templates public read-only
CREATE POLICY "Enable read access for matter templates" ON matter_templates
  FOR SELECT USING (true);

-- Make book parts public read-only
CREATE POLICY "Enable read access for book parts" ON book_parts
  FOR SELECT USING (true);

-- Make projects.user_id NOT NULL to enforce ownership
ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;

-- Create server-side platform fee calculation function
CREATE OR REPLACE FUNCTION calculate_platform_fee(payment_amount NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 5% platform fee
  RETURN ROUND(payment_amount * 0.05, 2);
END;
$$;

-- Add trigger to auto-calculate platform fees
CREATE OR REPLACE FUNCTION set_platform_fee()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.platform_fee = calculate_platform_fee(NEW.amount);
  RETURN NEW;
END;
$$;

CREATE TRIGGER calculate_platform_fee_trigger
  BEFORE INSERT ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_platform_fee();

-- Add triggers for validation functions
CREATE TRIGGER enforce_files_per_box_limit
  BEFORE INSERT ON manuscript_files
  FOR EACH ROW
  EXECUTE FUNCTION check_files_per_box();

CREATE TRIGGER enforce_bid_limit
  BEFORE INSERT ON project_bids
  FOR EACH ROW
  EXECUTE FUNCTION check_bid_limit();

-- Convert storage buckets to private and add RLS
UPDATE storage.buckets SET public = false WHERE id IN ('project_files', 'payment_attachments', 'manuscript_files');

-- Create RLS policies for storage
CREATE POLICY "Users can view their own project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project_files' AND 
    name ~ ('^' || auth.uid()::text || '/')
  );

CREATE POLICY "Users can upload their own project files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project_files' AND 
    name ~ ('^' || auth.uid()::text || '/')
  );

CREATE POLICY "Users can view their own payment attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment_attachments' AND 
    name ~ ('^' || auth.uid()::text || '/')
  );

CREATE POLICY "Users can upload their own payment attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment_attachments' AND 
    name ~ ('^' || auth.uid()::text || '/')
  );

CREATE POLICY "Users can view their own manuscript files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'manuscript_files' AND 
    name ~ ('^' || auth.uid()::text || '/')
  );

CREATE POLICY "Users can upload their own manuscript files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'manuscript_files' AND 
    name ~ ('^' || auth.uid()::text || '/')
  );

-- Update database functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_files_per_box()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM manuscript_files
    WHERE box_id = NEW.box_id
  ) >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 files allowed per box';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_bid_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    bid_count INTEGER;
    has_subscription BOOLEAN;
BEGIN
    -- Check if user has an active premium subscription
    SELECT EXISTS (
        SELECT 1
        FROM freelancer_subscriptions
        WHERE freelancer_id = NEW.freelancer_id
        AND tier = 'premium'
        AND starts_at <= NOW()
        AND (ends_at IS NULL OR ends_at > NOW())
    ) INTO has_subscription;
    
    IF has_subscription THEN
        -- Premium users can bid unlimited times
        RETURN NEW;
    END IF;
    
    -- Count existing bids for free users
    SELECT COUNT(*)
    FROM project_bids
    WHERE freelancer_id = NEW.freelancer_id
    INTO bid_count;
    
    IF bid_count >= 5 THEN
        RAISE EXCEPTION 'Free tier limit reached. Please upgrade to premium for unlimited bids.';
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_default_front_matter_options()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO front_matter_options (book_id, title, enabled, sort_order)
  VALUES
    (NEW.id, 'Table of Contents', false, 1),
    (NEW.id, 'Foreword', false, 2),
    (NEW.id, 'Preface', false, 3),
    (NEW.id, 'Acknowledgments', false, 4),
    (NEW.id, 'Copyright', false, 5),
    (NEW.id, 'Dedication', false, 6),
    (NEW.id, 'Epigraph', false, 7);
  RETURN NEW;
END;
$$;